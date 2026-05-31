# tarifas.imsolar.com.br

Ferramentas gratuitas de **tarifas de energia elétrica do Brasil**, com dados
oficiais da ANEEL:

- **Tarifas de energia sem impostos** — tabela filtrável (TUSD, TE e TUSD Fio B)
  por concessionária, subgrupo e modalidade.
- **Calculadora de fator de ajuste TE — Grupo A** — geração fora ponta
  necessária para compensar o consumo na ponta (tarifação binômia).

🔗 <https://tarifas.imsolar.com.br>

## Stack

- [Vite](https://vite.dev/) + [React 18](https://react.dev/) +
  [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) +
  [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- [React Router](https://reactrouter.com/) (URLs limpas) +
  [react-helmet-async](https://github.com/staylor/react-helmet-async) (SEO por rota)
- [TanStack Table](https://tanstack.com/table) (tabela de dados)
- Dados em `public/data/*.json`, carregados via `fetch` (fora do bundle)
- Deploy estático no **GitHub Pages**

## Desenvolvimento

Requer Node 20+ e [pnpm](https://pnpm.io/).

```bash
pnpm install        # instala dependências
pnpm dev            # servidor de desenvolvimento (http://localhost:5173)
pnpm build          # build de produção em build/ (gera sitemap.xml e 404.html)
pnpm preview        # serve o build localmente
pnpm typecheck      # checagem de tipos
pnpm lint           # ESLint
pnpm format         # Prettier
```

## Esquema de cores (tema)

Todo o tema é controlado por **CSS variables** em
[`src/index.css`](src/index.css). Para trocar a identidade visual, edite o bloco
de tokens no topo do arquivo — em especial as variáveis `--brand*`. Todos os
componentes derivam dessas variáveis (via `tailwind.config.js`), e há suporte a
**modo claro/escuro** (`.dark`).

```css
:root {
  --brand: 152 60% 36%; /* verde/esmeralda — troque para reposicionar a marca */
  /* … */
}
```

## Dados (ANEEL)

Os JSONs em `public/data/` são gerados pelo script Python em
[`scripts/aneel/`](scripts/aneel/) a partir dos Dados Abertos da ANEEL.

```bash
pip install -r scripts/aneel/requirements.txt
python3 scripts/aneel/fetch_tarifas.py     # regenera public/data/*.json
python3 scripts/aneel/test_derive.py       # valida a derivação (offline)
```

Veja [`scripts/aneel/README.md`](scripts/aneel/README.md) para detalhes. A data
da última atualização é lida de `public/data/meta.json` e exibida no site.

## Estrutura

```
src/
  components/      UI (shadcn/ui), layout, tema, SEO, tabela de tarifas
  hooks/           use-dataset (fetch), use-cascading-filters
  lib/             tipos, formatação, rotas, configuração do site
  pages/           home, sem-impostos, fator-ajuste, dúvidas, reportar, termos
public/data/       tarifas.json, fator-ajuste.json, meta.json
scripts/aneel/     script Python (ANEEL → JSON) + teste
scripts/build/     pós-build: sitemap.xml + 404.html
.github/workflows/ deploy (Pages) + atualização mensal das tarifas
```

## Automação

- **`deploy.yml`** — a cada push na `main`: typecheck, lint, build e deploy no
  GitHub Pages.
- **`update-tarifas.yml`** — mensal: roda o script da ANEEL e, havendo
  mudanças, abre um Pull Request com os dados novos para revisão.

## Licença

Ver [LICENSE](LICENSE).
