import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";
import { flatRoutes } from "remix-flat-routes";

export const routes = remixRoutesOptionAdapter((defineRoutes) => {
  return flatRoutes("routes", defineRoutes, {
    ignoredRouteFiles: ["**/.*"],
    // Using default values for other options, but you can customize:
    appDir: "app",
    routeDir: "routes",
    basePath: "/",
  });
}); 