const fs = require("fs");
const path = require("path");
const { generateMetadata } = require("../helpers/metadata");

function generateSiteMap() {
  const pages = generateMetadata();

  const lines = pages.reduce((acc, page) => {
    if (!page.siteMap) return acc;

    const line = `${page.meta.title}: ${page.meta.cannonical}`;
    return [...acc, line];
  }, []);

  return lines.join("\n");
}

function main() {
  const text = generateSiteMap();
  const filePath = path.join(__dirname, "../../public/sitemap.xml");
  fs.writeFileSync(filePath, text, "utf-8");
}

main();
