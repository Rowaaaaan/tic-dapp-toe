import { createRouter, createWebHashHistory } from "vue-router";
import GameView from "../views/GameView.vue";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: "/game",
    component: GameView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
