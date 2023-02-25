import MetaTags from "react-meta-tags";
import { getPageMetadata } from "./metadata";

export default function getRoutesWithMetadata(routes = []) {
  return routes.map((route) => {
    const page = getPageMetadata(route);
    route.meta = page.meta;

    const Component = route.component;
    const meta = route.meta;

    route.component = () => (
      <>
        <MetaTags>
          <title>{meta.title}</title>

          <meta name="description" content={meta.description} />
          <meta name="cannonical" content={meta.cannonical} />

          <meta property="og:title" content={meta["og:title"]} />
          <meta property="og:description" content={meta["og:description"]} />
          <meta property="og:url" content={meta.cannonical} />
        </MetaTags>
        {Component && <Component />}
      </>
    );

    return route;
  });
}
