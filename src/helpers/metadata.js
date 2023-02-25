const metadata = require("../config/metadata.json");
const clone = (obj) => JSON.parse(JSON.stringify(obj));

const getPageMetadata = (route) => {
  const publicUrl = "https://tarifas.imsolar.com.br";

  const pages = clone(metadata).pages;
  const defaultPage = clone(metadata).defaultPage;

  const page = pages.find((page) => page.path === route.path) || defaultPage;

  const title = `${page.meta?.title || defaultPage.title} | IM Solar`;
  const description = page.meta?.description || defaultPage.description;
  const ogDescription =
    page.meta?.shortDescription ||
    defaultPage.meta?.shortDescription ||
    page.meta?.description ||
    defaultPage.meta?.description;

  page.meta = {
    title: title,
    description: description,
    "og:title": title,
    "og:description": ogDescription,
    cannonical: `${publicUrl}/#${page.path}`,
  };
  return page;
};

exports.getPageMetadata = getPageMetadata;

exports.generateMetadata = () => {
  const pages = metadata.pages;
  const pagesWithMetadata = pages.map((page) => getPageMetadata(page));
  return pagesWithMetadata;
};
