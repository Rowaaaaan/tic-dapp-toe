import "./assets/main.css";
import "solana-wallets-vue/styles.css";
import router from "@/routes/router";

import { createApp } from "vue";
import { createPinia } from "pinia";

/**
 * Imports a buffer polyfill
 *
 * Required for the build version to have a buffer that web3 can use.
 * npm run dev will work just fine, because it uses the browser window's
 * buffer to do stuff.
 *
 * npm run build && npm run preview will ship a version that doesn't work
 * because it will throw "Error: Buffer not defined"
 *
 * I don't know why else this would work, but it does, and I don't want to
 * touch it anymore.
 */
import { Buffer } from "buffer";
globalThis.Buffer = Buffer;

import App from "@/App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
