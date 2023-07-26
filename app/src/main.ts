import "./assets/main.css";
import "solana-wallets-vue/styles.css";
import router from "@/routes/router";

import { createApp } from "vue";
import { createPinia } from "pinia";

import { initWallet } from "solana-wallets-vue";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import {
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
	wallets: [
		new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SlopeWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
	],
	autoConnect: true,
};

console.log(`Wallet options: `);
console.log(walletOptions);

initWallet(walletOptions);

import App from "@/App.vue";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
