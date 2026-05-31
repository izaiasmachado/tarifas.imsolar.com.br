#!/usr/bin/env python3
"""Teste offline da derivação do fator de ajuste.

`public/data/fator-ajuste.json` é derivado de `public/data/tarifas.json` pelo
mesmo `derive_fator_ajuste` usado em produção. Este teste garante essa
auto-consistência (sem acesso à rede) e protege a lógica contra regressões.
Roda no CI.

Uso:
    python scripts/aneel/test_derive.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from fetch_tarifas import derive_fator_ajuste  # noqa: E402

DATA_DIR = Path(__file__).resolve().parents[2] / "public" / "data"


def main() -> int:
    tarifas = json.loads((DATA_DIR / "tarifas.json").read_text("utf-8"))
    committed = json.loads((DATA_DIR / "fator-ajuste.json").read_text("utf-8"))

    derived = derive_fator_ajuste(tarifas)

    # 1) Auto-consistência: re-derivar de tarifas.json reproduz o arquivo
    #    versionado exatamente (mesma ordem, mesmos valores).
    if derived != committed:
        d_idx = {
            (e["concessionaria"], e["subgrupo"], e["modalidade"]): e
            for e in derived
        }
        c_idx = {
            (e["concessionaria"], e["subgrupo"], e["modalidade"]): e
            for e in committed
        }
        only_derived = set(d_idx) - set(c_idx)
        only_committed = set(c_idx) - set(d_idx)
        diffs = [
            (k, d_idx[k], c_idx[k])
            for k in set(d_idx) & set(c_idx)
            if d_idx[k] != c_idx[k]
        ]
        print("FALHA: fator-ajuste.json não está em sincronia com tarifas.json.")
        print(f"  só no derivado: {len(only_derived)}")
        print(f"  só no versionado: {len(only_committed)}")
        print(f"  valores divergentes: {len(diffs)}")
        for k, d, c in diffs[:5]:
            print(f"    {k}: derivado={d} versionado={c}")
        print(
            "  Rode `python3 scripts/aneel/fetch_tarifas.py` para "
            "regenerar os dados."
        )
        return 1

    # 2) Sanidade dos valores.
    bad = [
        e for e in derived if not (0.0 < float(e["fatorAjuste"]) <= 1.0)
    ]
    if bad:
        print(f"FALHA: {len(bad)} fatores fora de (0, 1]; ex.: {bad[0]}")
        return 1

    print(
        f"OK: {len(derived)} registros derivados reproduzem "
        f"fator-ajuste.json e os fatores estão em (0, 1]."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
