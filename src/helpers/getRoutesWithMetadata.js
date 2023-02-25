import MetaTags from "react-meta-tags";
import { generateMetadata } from "./metadata";

export default function getRoutesWithMetadata(routes = []) {
  const pages = generateMetadata() || [];

  return routes.map((route) => {
    const page = pages.find((page) => page.path === route.path) || {};
    const Component = route.component;
    const meta = page.meta;

    page.component = (
      <>
        <MetaTags>
          <title>{meta.title}</title>

          <meta name="description" content={meta.description} />
          <meta name="cannonical" content={meta.cannonical} />

          <meta property="og:title" content={meta["og:title"]} />
          <meta property="og:description" content={meta["og:description"]} />
          <meta property="og:url" content={meta.cannonical} />
        </MetaTags>
        <Component {...meta} />
      </>
    );

    return page;
  });
}
