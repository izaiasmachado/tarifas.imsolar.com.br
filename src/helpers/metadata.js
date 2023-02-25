exports.generateMetadata = function () {
  const publicUrl = "https://tarifas.imsolar.com.br";
  const defaultPage = {
    title: "Ferramentas Tarifação de Energia Elétrica",
    shortDescription:
      "Conheça nossas ferramentas para trabalho com tarifas de energia elétrica no Brasil",
    description:
      "Transforme sua rotina profissional e aumente sua produtividade com as melhores ferramentas disponíveis. Destaque-se no mercado de geração de energia!",
  };

  const pages = [
    { path: "/" },
    { path: "/termos-de-uso", meta: { title: "Termos de Uso" } },
    {
      path: "/sem-impostos",
      siteMap: true,
      showInMenu: true,
      meta: {
        title: "Tarifas de Energia Sem Impostos",
        description:
          "Tabela com tarifas de energia elétrica sem impostos, separado por concessionária de energia e com filtros relevantes.",
      },
    },
    {
      path: "/fator-ajuste-grupo-a",
      showInMenu: true,
      siteMap: true,
      meta: {
        title: "Calculadora Fator de Ajuste TE - Grupo A",
        description:
          "Calculadora de energia fora ponta necessária para compensar o consumo da hora ponta, em clientes Grupo A com tarifação binômia.",
      },
    },
  ];

  const pagesWithMetadata = pages.map((page) => {
    const title = `${page.meta?.title || defaultPage.title} | IM Solar`;
    const description = page.meta?.description || defaultPage.description;
    const ogDescription =
      page.meta?.shortDescription ||
      defaultPage.shortDescription ||
      page.meta?.description ||
      defaultPage.description;

    page.meta = {
      title: title,
      description: description,
      "og:title": title,
      "og:description": ogDescription,
      cannonical: `${publicUrl}/#${page.path}`,
    };
    return page;
  });

  return pagesWithMetadata;
};
