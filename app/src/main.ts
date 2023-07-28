import "./assets/main.css";
import "solana-wallets-vue/styles.css";
import router from "@/routes/router";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
