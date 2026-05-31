#!/usr/bin/env python3
"""Teste offline da derivação do fator de ajuste.

Valida ``derive_fator_ajuste`` contra os dados versionados em
``public/data``, sem acesso à rede. Roda no CI para proteger a lógica de
derivação contra regressões.

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
    expected = json.loads((DATA_DIR / "fator-ajuste.json").read_text("utf-8"))

    derived = derive_fator_ajuste(tarifas)

    expected_index = {
        (e["concessionaria"], e["subgrupo"], e["modalidade"]): e
        for e in expected
    }
    derived_index = {
        (d["concessionaria"], d["subgrupo"], d["modalidade"]): d
        for d in derived
    }

    mismatches = 0
    for key, exp in expected_index.items():
        got = derived_index.get(key)
        if got is None:
            # Registros ausentes na base de origem são tolerados; o que não
            # pode acontecer é um valor DIFERENTE para a mesma chave.
            continue
        same = (
            abs(
                float(got["totalTEForaPonta"]) - float(exp["totalTEForaPonta"])
            )
            < 0.01
            and abs(float(got["totalTEPonta"]) - float(exp["totalTEPonta"]))
            < 0.01
            and abs(float(got["fatorAjuste"]) - float(exp["fatorAjuste"]))
            < 1e-6
        )
        if not same:
            mismatches += 1
            print(f"MISMATCH {key}: got={got} expected={exp}")

    covered = len(set(expected_index) & set(derived_index))
    print(
        f"derivados={len(derived)} esperados={len(expected)} "
        f"cobertos={covered} divergencias={mismatches}"
    )

    if mismatches:
        print("FALHA: a derivação produziu valores divergentes.")
        return 1
    if covered < len(expected) * 0.95:
        print("FALHA: cobertura abaixo de 95% dos registros esperados.")
        return 1
    print("OK: derivação do fator de ajuste validada.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
