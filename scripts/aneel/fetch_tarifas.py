#!/usr/bin/env python3
"""Gera os dados de tarifas do site a partir dos Dados Abertos da ANEEL.

Saídas (em ``public/data/``):
  - ``tarifas.json``       Tarifas de aplicação sem impostos (TUSD, TE, TUSD Fio B).
  - ``fator-ajuste.json``  Derivado: fator de ajuste da TE para o Grupo A.
  - ``meta.json``          Metadados (data de atualização, vigência, fonte).

Fonte: ANEEL — "Tarifas homologadas das distribuidoras de energia elétrica"
(portal CKAN em https://dadosabertos.aneel.gov.br).

O script é tolerante a mudanças: descobre o recurso pelo ``package_show`` e
permite ajustar o mapa de colunas no topo do arquivo caso a ANEEL renomeie
campos. Use ``--dump-schema`` na primeira execução para inspecionar as colunas
reais retornadas pela API.

Exemplos:
    python fetch_tarifas.py                  # baixa da ANEEL e escreve os JSONs
    python fetch_tarifas.py --dump-schema    # só mostra as colunas do recurso
    python fetch_tarifas.py --from-csv x.csv # processa um CSV já baixado
    python fetch_tarifas.py --limit 5000     # processa apenas N linhas (teste)
"""

from __future__ import annotations

import argparse
import csv
import io
import json
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Iterable

try:
    import requests
except ImportError:  # pragma: no cover - dependência só usada no modo online
    requests = None  # type: ignore


# ---------------------------------------------------------------------------
# Configuração — ajuste aqui se a ANEEL mudar nomes de dataset/colunas.
# ---------------------------------------------------------------------------

PORTAL = "https://dadosabertos.aneel.gov.br"
# Slug do conjunto de dados no CKAN da ANEEL.
DATASET_SLUG = "tarifas-distribuidoras-energia-eletrica"
# Recurso conhecido (CSV das tarifas homologadas). Fallback caso a descoberta
# automática não encontre um CSV adequado.
FALLBACK_RESOURCE_ID = "fcf2906c-7c32-4b9b-a637-054e7a5234f4"

# Apenas a tarifa efetivamente cobrada (sem impostos), não a base econômica.
BASE_TARIFARIA_ALVO = "Tarifa de Aplicação"

# Mapa: campo de saída -> nome da coluna na base da ANEEL.
# A busca é tolerante a caixa/acentos (ver _norm).
COLUMN_MAP = {
    "concessionaria": "SigAgente",
    "subgrupo": "DscSubGrupo",
    "modalidade": "DscModalidadeTarifaria",
    "classe": "DscClasse",
    "subclasse": "DscSubClasse",
    "detalhe": "DscDetalhe",
    "posto": "NomPostoTarifario",
    "unidade": "DscUnidadeTerciaria",
    "acessante": "SigAgenteAcessante",
    "totalTUSD": "VlrTUSD",
    "totalTE": "VlrTE",
}
# Coluna da base tarifária (filtro) e das datas (metadados).
COL_BASE_TARIFARIA = "DscBaseTarifaria"
COL_DATA_GERACAO = "DatGeracaoConjuntoDados"
COL_INICIO_VIGENCIA = "DatInicioVigencia"
# Coluna opcional com o valor da TUSD Fio B (quando publicada na própria base).
COL_FIO_B_CANDIDATES = ["VlrTUSDFioB", "VlrFioB", "TUSDFioB"]

# Derivação do fator de ajuste (Grupo A, tarifação binômia).
POSTO_PONTA = "Ponta"
POSTO_FORA_PONTA = "Fora ponta"
DETALHE_PADRAO = "Não se aplica"
UNIDADE_ENERGIA = "MWh"
# Classe padrão (não-descontada). Classes como "Rural" têm TE reduzida e não
# entram no fator de ajuste de referência.
CLASSE_PADRAO = "Não se aplica"
MODALIDADES_BINOMIAS = {"Azul", "Verde"}

DEFAULT_OUTPUT_DIR = Path(__file__).resolve().parents[2] / "public" / "data"


# ---------------------------------------------------------------------------
# Utilitários
# ---------------------------------------------------------------------------


def log(msg: str) -> None:
    print(f"[aneel] {msg}", file=sys.stderr)


def _norm(name: str) -> str:
    """Normaliza um nome de coluna para comparação tolerante."""
    return "".join(ch for ch in name.lower() if ch.isalnum())


def resolve_columns(fieldnames: Iterable[str]) -> dict[str, str]:
    """Mapeia os nomes desejados para os nomes reais presentes no arquivo."""
    available = {_norm(f): f for f in fieldnames}
    resolved: dict[str, str] = {}
    missing: list[str] = []
    for out_key, aneel_col in COLUMN_MAP.items():
        real = available.get(_norm(aneel_col))
        if real is None:
            missing.append(aneel_col)
        else:
            resolved[out_key] = real
    if missing:
        raise SystemExit(
            "Colunas não encontradas na base da ANEEL: "
            + ", ".join(missing)
            + ".\nColunas disponíveis: "
            + ", ".join(sorted(fieldnames))
            + "\nAjuste COLUMN_MAP no topo de fetch_tarifas.py."
        )
    base_col = available.get(_norm(COL_BASE_TARIFARIA))
    if base_col is None:
        raise SystemExit(
            f"Coluna de base tarifária ({COL_BASE_TARIFARIA}) não encontrada."
        )
    resolved["_base"] = base_col
    for cand in COL_FIO_B_CANDIDATES:
        real = available.get(_norm(cand))
        if real:
            resolved["TUSDFioB"] = real
            break
    for key, col in (
        ("_dataGeracao", COL_DATA_GERACAO),
        ("_inicioVigencia", COL_INICIO_VIGENCIA),
    ):
        real = available.get(_norm(col))
        if real:
            resolved[key] = real
    return resolved


def parse_decimal_br(value: str | None) -> float:
    """Converte um decimal em formato brasileiro ('1.234,56') para float."""
    if value is None:
        return 0.0
    text = value.strip()
    if not text:
        return 0.0
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    try:
        return float(text)
    except ValueError:
        return 0.0


def parse_date(value: str | None) -> str | None:
    """Tenta extrair uma data ISO (YYYY-MM-DD) de formatos comuns da ANEEL."""
    if not value:
        return None
    text = value.strip()[:19]
    for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%Y-%m-%dT%H:%M:%S", "%Y/%m/%d"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _fmt(value: float) -> str:
    """Formata um valor monetário como string com 2 casas (ponto decimal)."""
    return f"{value:.2f}"


# ---------------------------------------------------------------------------
# Acesso à ANEEL (CKAN)
# ---------------------------------------------------------------------------


def _require_requests() -> None:
    if requests is None:
        raise SystemExit(
            "O pacote 'requests' é necessário no modo online. "
            "Instale com: pip install -r scripts/aneel/requirements.txt"
        )


def discover_csv_url(timeout: int = 60) -> str:
    """Descobre a URL do CSV de tarifas via package_show (com fallback)."""
    _require_requests()
    url = f"{PORTAL}/api/3/action/package_show"
    log(f"descobrindo recurso em {DATASET_SLUG}…")
    try:
        resp = requests.get(url, params={"id": DATASET_SLUG}, timeout=timeout)
        resp.raise_for_status()
        resources = resp.json()["result"]["resources"]
        csvs = [r for r in resources if (r.get("format") or "").upper() == "CSV"]
        for r in csvs:
            name = (r.get("name") or "").lower()
            if "homolog" in name or "aplica" in name or "tarifa" in name:
                log(f"recurso escolhido: {r.get('name')} ({r.get('id')})")
                return r["url"]
        if csvs:
            log(f"usando primeiro CSV: {csvs[0].get('name')}")
            return csvs[0]["url"]
    except Exception as exc:  # noqa: BLE001 - fallback abaixo
        log(f"package_show falhou ({exc}); usando resource_id fixo.")

    return (
        f"{PORTAL}/dataset/{DATASET_SLUG}/resource/{FALLBACK_RESOURCE_ID}/"
        "download/tarifas-homologadas-distribuidoras-energia-eletrica.csv"
    )


def download_csv_text(url: str, timeout: int = 180) -> str:
    """Baixa o CSV e devolve o texto decodificado (tenta utf-8 e latin-1)."""
    _require_requests()
    log(f"baixando {url}")
    resp = requests.get(url, timeout=timeout)
    resp.raise_for_status()
    raw = resp.content
    for enc in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return raw.decode(enc)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="replace")


# ---------------------------------------------------------------------------
# Processamento
# ---------------------------------------------------------------------------


def read_rows(text: str) -> tuple[list[dict[str, str]], list[str]]:
    """Lê o CSV (detecta ';' ou ',') e devolve linhas + nomes de coluna."""
    sample = text[:4096]
    delimiter = ";" if sample.count(";") >= sample.count(",") else ","
    reader = csv.DictReader(io.StringIO(text), delimiter=delimiter)
    rows = list(reader)
    return rows, list(reader.fieldnames or [])


def build_tarifas(
    rows: list[dict[str, str]], cols: dict[str, str]
) -> list[dict[str, str]]:
    """Filtra a 'Tarifa de Aplicação' e mapeia para o schema do site."""
    out: list[dict[str, str]] = []
    fio_b_col = cols.get("TUSDFioB")
    for row in rows:
        if (row.get(cols["_base"]) or "").strip() != BASE_TARIFARIA_ALVO:
            continue
        tusd = parse_decimal_br(row.get(cols["totalTUSD"]))
        te = parse_decimal_br(row.get(cols["totalTE"]))
        fio_b = parse_decimal_br(row.get(fio_b_col)) if fio_b_col else 0.0
        record = {
            "concessionaria": (row.get(cols["concessionaria"]) or "").strip(),
            "subgrupo": (row.get(cols["subgrupo"]) or "").strip(),
            "modalidade": (row.get(cols["modalidade"]) or "").strip(),
            "classe": (row.get(cols["classe"]) or "").strip(),
            "subclasse": (row.get(cols["subclasse"]) or "").strip(),
            "detalhe": (row.get(cols["detalhe"]) or "").strip(),
            "posto": (row.get(cols["posto"]) or "").strip(),
            "unidade": (row.get(cols["unidade"]) or "").strip(),
            "acessante": (row.get(cols["acessante"]) or "").strip(),
            "totalTUSD": _fmt(tusd),
            "totalTE": _fmt(te),
            "TUSDFioB": str(fio_b),
        }
        if not record["concessionaria"]:
            continue
        out.append(record)
    return out


def derive_fator_ajuste(tarifas: list[dict[str, str]]) -> list[dict[str, str]]:
    """Deriva o fator de ajuste da TE para o Grupo A (modalidades binômias).

    Lógica validada contra a base anterior do projeto: para cada
    (concessionária, subgrupo, modalidade) do Grupo A, usando as linhas de
    energia (MWh) da classe padrão com detalhe padrão, o fator é
    TE_foraPonta / TE_ponta.

    A base traz, para a mesma chave/posto, linhas duplicadas com valores
    diferentes (ex.: tarifa cheia vs. variações). Tomamos o MAIOR TE por posto,
    que corresponde à tarifa de referência (as variações descontadas, como a
    classe Rural, ficam de fora pelo filtro de classe).
    """
    grouped: dict[tuple[str, str, str], dict[str, float]] = {}
    for t in tarifas:
        if not t["subgrupo"].startswith("A"):
            continue
        if t["modalidade"] not in MODALIDADES_BINOMIAS:
            continue
        if t["detalhe"] != DETALHE_PADRAO or t["unidade"] != UNIDADE_ENERGIA:
            continue
        if t["classe"] != CLASSE_PADRAO:
            continue
        if t["posto"] not in (POSTO_PONTA, POSTO_FORA_PONTA):
            continue
        key = (t["concessionaria"], t["subgrupo"], t["modalidade"])
        posto = grouped.setdefault(key, {})
        value = float(t["totalTE"])
        posto[t["posto"]] = max(posto.get(t["posto"], 0.0), value)

    out: list[dict[str, str]] = []
    for (conc, sub, mod), postos in sorted(grouped.items()):
        if POSTO_PONTA not in postos or POSTO_FORA_PONTA not in postos:
            continue
        ponta = postos[POSTO_PONTA]
        fora = postos[POSTO_FORA_PONTA]
        if ponta <= 0:
            continue
        out.append(
            {
                "concessionaria": conc,
                "subgrupo": sub,
                "modalidade": mod,
                "totalTEForaPonta": _fmt(fora),
                "totalTEPonta": _fmt(ponta),
                "fatorAjuste": str(fora / ponta),
            }
        )
    return out


def build_meta(
    rows: list[dict[str, str]],
    cols: dict[str, str],
    total: int,
    today_iso: str,
) -> dict:
    """Monta os metadados do dataset (data de atualização e vigência)."""
    data_geracao = None
    inicio_vigencia = None
    if rows:
        data_geracao = parse_date(rows[0].get(cols.get("_dataGeracao", "")))
        vig_col = cols.get("_inicioVigencia")
        if vig_col:
            vigs = sorted(
                {parse_date(r.get(vig_col)) for r in rows if r.get(vig_col)}
                - {None}
            )
            if vigs:
                inicio_vigencia = vigs[-1]
    return {
        "updatedAt": data_geracao or today_iso,
        "vigenciaInicio": inicio_vigencia,
        "fonte": (
            "ANEEL — Tarifas homologadas das distribuidoras de energia "
            "elétrica (Dados Abertos)"
        ),
        "fonteUrl": f"{PORTAL}/dataset/{DATASET_SLUG}",
        "totalRegistros": total,
    }


def write_json(path: Path, data, dry_run: bool) -> None:
    if dry_run:
        log(f"[dry-run] escreveria {path} ({_count(data)})")
        return
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    log(f"escrito {path} ({_count(data)})")


def _count(data) -> str:
    if isinstance(data, list):
        return f"{len(data)} registros"
    return f"{len(data)} chaves"


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--from-csv",
        type=Path,
        help="Processa um CSV local em vez de baixar da ANEEL.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help="Diretório de saída dos JSONs (padrão: public/data).",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Processa no máximo N linhas do CSV (0 = todas).",
    )
    parser.add_argument(
        "--dump-schema",
        action="store_true",
        help="Apenas imprime as colunas do recurso e sai.",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Executa sem escrever arquivos.",
    )
    parser.add_argument(
        "--today",
        default=date.today().isoformat(),
        help="Data ISO usada como fallback de updatedAt.",
    )
    args = parser.parse_args(argv)

    if args.from_csv:
        log(f"lendo CSV local {args.from_csv}")
        text = args.from_csv.read_text(encoding="utf-8", errors="replace")
    else:
        text = download_csv_text(discover_csv_url())

    rows, fieldnames = read_rows(text)
    if not fieldnames:
        raise SystemExit("CSV sem cabeçalho legível.")
    log(f"{len(rows)} linhas lidas; {len(fieldnames)} colunas")

    if args.dump_schema:
        print("\n".join(sorted(fieldnames)))
        return 0

    if args.limit:
        rows = rows[: args.limit]

    cols = resolve_columns(fieldnames)
    tarifas = build_tarifas(rows, cols)
    if not tarifas:
        raise SystemExit(
            "Nenhuma 'Tarifa de Aplicação' encontrada — verifique o filtro "
            f"({COL_BASE_TARIFARIA} == '{BASE_TARIFARIA_ALVO}')."
        )
    fator = derive_fator_ajuste(tarifas)
    meta = build_meta(rows, cols, len(tarifas), args.today)

    if "TUSDFioB" not in cols:
        log(
            "AVISO: coluna de TUSD Fio B não encontrada na base; "
            "TUSDFioB definido como 0.0. Veja o README para habilitar o "
            "cruzamento com a base de Componentes Tarifárias."
        )

    log(
        f"tarifas={len(tarifas)} fator_ajuste={len(fator)} "
        f"updatedAt={meta['updatedAt']}"
    )

    out = args.output_dir
    write_json(out / "tarifas.json", tarifas, args.dry_run)
    write_json(out / "fator-ajuste.json", fator, args.dry_run)
    write_json(out / "meta.json", meta, args.dry_run)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
