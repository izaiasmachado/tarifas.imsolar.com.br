import Home from "./Home/Home";
import Terms from "./Terms/Terms";
import TarifasEnergiaSemImpostos from "./TarifasEnergiaSemImpostos/TarifasEnergiaSemImpostos";
import FatorAjusteGrupoA from "./FatorAjusteGrupoA/FatorAjusteGrupoA";
import MetaTags from "react-meta-tags";

export function generateJSONSiteMap() {
  const sitemap = {
    publicUrl: "https://tarifas.imsolar.com.br",
  };

  const defaultPage = {
    title: "Ferramentas Tarifação de Energia Elétrica",
    shortDescription:
      "Conheça nossas ferramentas para trabalho com tarifas de energia elétrica no Brasil",
    description:
      "Transforme sua rotina profissional e aumente sua produtividade com as melhores ferramentas disponíveis. Destaque-se no mercado de geração de energia!",
  };

  const pages = [
    { path: "/", component: Home },
    { path: "/termos-de-uso", component: Terms, title: "Termos de Uso" },
    {
      path: "/sem-impostos",
      component: TarifasEnergiaSemImpostos,
      showInMenu: true,
      title: "Tarifas de Energia Sem Impostos",
      description:
        "Tabela com tarifas de energia elétrica sem impostos, separado por concessionária de energia e com filtros relevantes.",
    },
    {
      path: "/fator-ajuste-grupo-a",
      component: FatorAjusteGrupoA,
      showInMenu: true,
      title: "Calculadora Fator de Ajuste TE - Grupo A",
      description:
        "Calculadora de energia fora ponta necessária para compensar o consumo da hora ponta, em clientes Grupo A com tarifação binômia.",
    },
  ];

  const pageWithMetadata = pages.map((page) => {
    const Component = page.component;
    console.log(page.title, page);

    const meta = {
      title: `${page.title || defaultPage.title} | IM Solar`,
      description: page.description || defaultPage.description,
      cannonical: `${sitemap.publicUrl}${page.path}`,
      meta: {
        "og:title": `${page.title || defaultPage.title} | IM Solar`,
        "og:description":
          page.shortDescription ||
          defaultPage.shortDescription ||
          page.description ||
          defaultPage.description,
      },
    };

    page.component = (
      <>
        <MetaTags>
          <title>{meta.title}</title>

          <meta name="description" content={meta.description} />
          <meta name="cannonical" content={meta.cannonical} />

          <meta property="og:title" content={meta.meta["og:title"]} />
          <meta
            property="og:description"
            content={meta.meta["og:description"]}
          />
          <meta property="og:url" content={meta.cannonical} />
        </MetaTags>
        <Component />
      </>
    );

    return page;
  });

  sitemap.pages = pageWithMetadata;
  return sitemap;
}
