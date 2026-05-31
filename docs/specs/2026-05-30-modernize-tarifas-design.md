# Modernização do tarifas.imsolar.com.br — Design

**Data:** 2026-05-30
**Branch:** `feature/modernize-vite-shadcn`
**Autor:** Izaias Machado

> Documento escrito em modo autônomo. Registra as decisões tomadas para revisão
> posterior (o trabalho foi autorizado para rodar durante a noite, então o PR é
> a superfície de revisão).

## 1. Objetivo

Modernizar 100% o site de ferramentas de tarifas de energia, deixando-o
profissional, padronizado, fácil de manter (esquema de cores trocável por
variáveis) e **bem indexável** por buscadores. Adicionar um script que
reconstrói os dados de tarifas a partir da ANEEL e uma automação mensal.

## 2. Stack

| Antes | Depois |
|---|---|
| Create React App (`react-scripts`) | **Vite 5** |
| JavaScript | **TypeScript** |
| Material-UI v4 + MUI v5 + Emotion | **Tailwind CSS v3 + Shadcn/UI** (Radix) |
| `HashRouter` (URLs com `#`) | **React Router 6, URLs limpas** (BrowserRouter) |
| `react-meta-tags` | **react-helmet-async** (meta por rota) |
| Dados via `import` no bundle | **`fetch` de `/public/data/*.json`** |
| npm/yarn | **pnpm** |

React 18 é mantido (decisão do usuário). TypeScript adotado por ser o padrão do
Shadcn/UI e mais profissional.

## 3. Design system / tema

- Tokens de cor em **CSS variables** no `src/index.css` (`:root` e `.dark`),
  padrão Shadcn (HSL). **Trocar a paleta = editar um arquivo.**
- `tailwind.config.js` referencia os tokens (`--background`, `--primary`, etc.).
- **Dark mode** via classe `.dark` + `ThemeProvider` com persistência em
  `localStorage` (substitui o "brightness button" da branch anterior).
- Tipografia (Inter), raios e espaçamentos padronizados via tokens.
- Paleta primária: verde/esmeralda (energia/solar), em um único bloco de tokens.

## 4. Arquitetura de rotas e SEO

- **URLs limpas** (BrowserRouter): `/`, `/sem-impostos`,
  `/fator-ajuste-grupo-a`, `/termos-de-uso`, `/duvidas` (FAQ), `/reportar`.
- **Meta por rota** com `react-helmet-async`: title, description, canonical,
  Open Graph e **JSON-LD** (WebSite, FAQPage, BreadcrumbList).
- **Sitemap XML válido** gerado no build (o atual gera texto puro, inválido).
- `robots.txt` revisado; **`404.html`** para suportar deep-links no GitHub Pages.
- Conteúdo novo para SEO long-tail: página de **dúvidas/FAQ** e textos
  explicativos (o que é fator de ajuste, TUSD/TE, Fio B, etc.).
- **Evolução futura — SSG**: migrar para `vite-react-ssg` para HTML
  pré-renderizado por rota. Componentes escritos SSR-safe para facilitar.

## 5. Camada de dados

- `tarifas.json`, `fator-ajuste.json`, `meta.json` movidos para `public/data/`.
- `meta.json`: `{ updatedAt, vigenciaInicio, fonte, totalRegistros }` → site
  exibe **"Tarifas atualizadas em …"**.
- Hook `useDataset` (fetch + loading/erro). Tipos TS para os registros.

## 6. Páginas/componentes

- **Layout**: Navbar (links reais — corrige `/tools`, `/pricing` mortos),
  Footer, ThemeToggle, container responsivo.
- **Home**: hero + cards das ferramentas (`to=` em vez de `href=`), badge de
  última atualização, compartilhar.
- **Sem impostos**: filtros em cascata (Combobox) + **DataTable** (TanStack)
  paginada, com busca e ordenação; corrige `key` indefinida.
- **Fator de Ajuste Grupo A**: calculadora — corrige a **mutação de estado/JSON**
  (cálculo puro derivado).
- **Termos de Uso**: tipografia padronizada.
- **Dúvidas (FAQ)**: conteúdo + JSON-LD FAQPage (SEO).
- **Reportar erro/sugestão**: formulário (react-hook-form + zod). **Estático por
  enquanto**: `mailto:` + endpoint opcional via `VITE_REPORT_ENDPOINT`.

## 7. Script Python (`scripts/aneel/`)

- `fetch_tarifas.py`: baixa os dados abertos da ANEEL (CKAN), filtra
  `DscBaseTarifaria == "Tarifa de Aplicação"`, mapeia colunas → schema do site,
  deriva `fator-ajuste.json` (fator = TE fora-ponta ÷ TE ponta, Grupo A
  azul/verde) e escreve `meta.json`.
- **Robusto**: auto-descobre os recursos via `package_show`, `COLUMN_MAP`
  configurável, decimais BR, `--limit`/`--dry-run`/`--dump-schema`.
- **TUSD Fio B**: do recurso de componentes quando disponível; senão `0.0` com
  aviso (documentado).
- `requirements.txt` (apenas `requests`), `README.md` e `test_derive.py`
  (validação offline da derivação).

## 8. Automação (GitHub Actions)

- **`deploy.yml`** — pnpm + build Vite + deploy para GitHub Pages a cada push
  na `main` (com typecheck e lint).
- **`update-tarifas.yml`** — mensal (cron): roda o script Python e abre PR com
  os dados novos (revisão manual antes de publicar).

## 9. Itens corrigidos (bugs do código atual)

- Links mortos (`/tools`, `/pricing`, `/#contact`) e `<Link href>` → `to`.
- `key={row.name}` indefinida na tabela.
- Mutação de JSON importado e de array no render na calculadora.
- `cannonical` (typo) → `canonical`; sitemap inválido; dados pesados no bundle.

## 10. Não-objetivos (por ora)

- Backend/persistência do formulário (fica estático).
- Trocar de hospedagem (continua GitHub Pages).
- SSG/pré-render (evolução futura — exige build validado em CI).
- i18n (site é PT-BR).

## 11. Notas de ambiente (execução autônoma)

- `npm registry` acessível → dependências instaladas e build validável.
- **CKAN da ANEEL inacessível** a partir do ambiente (timeout) → o script foi
  escrito defensivamente e a derivação validada contra os JSONs existentes como
  fixture. A primeira execução real confirmará o mapa de colunas.
- Global `~/.npmrc`/config faz binários opcionais não instalarem por padrão;
  sobrescrito localmente com `optional=true` (Vite/esbuild precisam deles).
