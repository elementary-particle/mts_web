/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router/auto";
import { setupLayouts } from "virtual:generated-layouts";
import type { RouteRecordRaw } from "vue-router/auto";

function recursiveLayouts(route: RouteRecordRaw): RouteRecordRaw {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++) {
      route.children[i] = recursiveLayouts(route.children[i]);
    }

    return route;
  }

  return setupLayouts([route])[0];
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  extendRoutes(routes) {
    return routes.map(recursiveLayouts);
  },
});

export default router;
