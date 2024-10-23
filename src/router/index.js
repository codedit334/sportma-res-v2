import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("../views/HomePage.vue"),
    },
    {
      path: "/calender",
      component: () => import("../views/Calender.vue"),
    },
  ],
});

export default router;
