# Script de tarifas da ANEEL

Gera os dados consumidos pelo site a partir dos **Dados Abertos da ANEEL**
(conjunto _Tarifas homologadas das distribuidoras de energia elétrica_).

## Saídas

Escreve em `public/data/`:

| Arquivo | Conteúdo |
|---|---|
| `tarifas.json` | Tarifas de aplicação sem impostos (TUSD, TE, TUSD Fio B). |
| `fator-ajuste.json` | Derivado: fator de ajuste da TE para o Grupo A (modalidades Azul/Verde). |
| `meta.json` | Metadados: `updatedAt`, `vigenciaInicio`, `fonte`, `totalRegistros`. |

## Uso

```bash
# (opcional) ambiente virtual
python3 -m venv .venv && source .venv/bin/activate

pip install -r scripts/aneel/requirements.txt

# Baixa da ANEEL e regenera os JSONs em public/data
python3 scripts/aneel/fetch_tarifas.py

# Inspecionar as colunas reais do recurso (útil se a ANEEL mudar o schema)
python3 scripts/aneel/fetch_tarifas.py --dump-schema

# Processar um CSV já baixado, sem rede
python3 scripts/aneel/fetch_tarifas.py --from-csv tarifas.csv

# Teste rápido com poucas linhas, sem escrever arquivos
python3 scripts/aneel/fetch_tarifas.py --limit 5000 --dry-run

# Sem barra de progresso (ex.: logs de CI)
python3 scripts/aneel/fetch_tarifas.py --no-progress
```

O download exibe uma **barra de progresso** com percentual, tamanho,
velocidade, tempo decorrido e ETA; cada fase (download, leitura, processamento)
reporta o tempo gasto e, ao final, o tempo total. A barra é desativada
automaticamente quando a saída não é um terminal (CI) ou com `--no-progress`.

## Como funciona

1. **Descoberta do recurso** — consulta `package_show` no CKAN da ANEEL e
   escolhe o CSV de tarifas homologadas. Se a API estiver indisponível, usa um
   `resource_id` fixo como fallback.
2. **Filtro** — mantém apenas linhas com
   `DscBaseTarifaria == "Tarifa de Aplicação"` (a tarifa efetivamente cobrada,
   sem impostos).
3. **Mapeamento de colunas** — converte os nomes da ANEEL (`SigAgente`,
   `DscSubGrupo`, `VlrTUSD`, …) para o schema do site. O mapa fica em
   `COLUMN_MAP`, no topo de `fetch_tarifas.py`, e a busca é tolerante a
   caixa/acentos.
4. **Derivação do fator de ajuste** — para cada
   (concessionária, subgrupo, modalidade) do Grupo A nas modalidades binômias,
   usando as linhas de energia (`MWh`, detalhe padrão), calcula
   `fator = TE_foraPonta / TE_ponta`. Lógica validada contra a base anterior do
   projeto (ver `test_derive.py`).
5. **Metadados** — extrai a data de geração/vigência da própria base.

## TUSD Fio B

A TUSD Fio B é uma parcela da TUSD. Quando a base principal traz uma coluna de
Fio B (ver `COL_FIO_B_CANDIDATES`), o script a utiliza diretamente. Caso
contrário, `TUSDFioB` é gravado como `0.0` e um aviso é emitido — nesse cenário,
é necessário cruzar com o conjunto **Componentes Tarifárias** da ANEEL
(evolução futura: adicionar `--componentes <csv>` para o join pelas chaves
naturais subgrupo/modalidade/classe/posto).

## Teste offline

```bash
python3 scripts/aneel/test_derive.py
```

Valida a derivação do fator de ajuste contra os JSONs versionados, sem rede.
Executado no CI.

## Automação

O workflow `.github/workflows/update-tarifas.yml` roda este script
mensalmente e, havendo mudanças, abre um Pull Request com os dados novos para
revisão antes da publicação.
