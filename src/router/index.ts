/**
 * router/index.ts
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import type { RouteRecordRaw } from "vue-router";

import Home from "@/components/Home.vue";
import Project from "@/components/Project.vue";
import Unit from "@/components/Unit.vue";
import NotFound from "@/components/NotFound.vue";

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
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/project/:id",
      component: Project,
      props: true,
    },
    {
      path: "/unit/:id",
      component: Unit,
      props: true,
      meta: {
        requiresAuth: true,
        layout: "window",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      component: NotFound,
      meta: {
        layout: "window",
      },
    },
  ].map(recursiveLayouts),
  strict: true,
});

export default router;
