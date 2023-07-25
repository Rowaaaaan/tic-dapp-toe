import { createRouter, createWebHashHistory } from "vue-router";
import GameView from "../views/GameView.vue";
import HomeView from "../views/HomeView.vue";
import NotFound from "../views/NotFound.vue";
import GameNotFound from "../views/GameNotFound.vue";

const routes = [
	{
		name: "home",
		path: '/',
		component: HomeView,
	},
	{
		path: "/game/:gameId",
		component: GameView,
	},
	{
		path: '/game/:pathMatch(.*)*',
		name: "GameNotFound",
		component: GameNotFound
	},
	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: NotFound
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
