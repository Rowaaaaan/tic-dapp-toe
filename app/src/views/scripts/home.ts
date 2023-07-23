import { useWallet } from "solana-wallets-vue";
import { onMounted, ref } from "vue";
import { useWorkspace } from "@/stores/workspace";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useRouter } from "vue-router";

export default {
	setup() {
		const openGames = ref([{ hash: "5EMotaRURdn8mvcSvZPTesCGRp8pVcMBhzrj83AydNSS" },
		{ hash: "532PUaK4Pz3Fj8xgf8UijPCXk1fmqEH5LBZxTd8nUSeQ" }]);
		console.log(`# of open games: ${openGames.value.length}`)
		const router = useRouter();
		let { wallet, provider } = useWorkspace();
		console.log("Wallet Data: ");
		console.log(wallet);

		const isWalletConnected = (wallet.value?.publicKey != undefined);
		console.log("Wallet connected: ");
		console.log(isWalletConnected);

		console.log("Provider data: ");
		console.log(provider.value);

		const onJoinGame = () => {
			router.push({ path: "/game" });
		}

		const onCreateGame = () => {
			console.log("Game created");
			router.push({ path: "/game" });
		}

		return { openGames, wallet, isWalletConnected, onJoinGame, onCreateGame };
	},
};
