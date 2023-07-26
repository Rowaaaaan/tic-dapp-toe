import { onMounted, ref } from "vue";
import type { Ref } from "vue";
import { useWorkspace } from "../../stores/workspace";
import { useGameManager } from "./game-manager";
import { useRouter } from "vue-router";
import { PublicKey, Keypair } from "@solana/web3.js";

export default {
	setup() {
		const { createGame } = useGameManager();
		const playerTwoPubKeyRef = ref("");
		const gameIdRef = ref("");

		const router = useRouter();
		let { userWallet, provider } = useWorkspace();
		console.log("Wallet Data: ");
		console.log(userWallet);

		const isWalletConnected = userWallet.connected;
		console.log("Wallet connected: ");
		console.log(isWalletConnected.value);

		console.log("Provider data: ");
		console.log(provider.value);

		const onJoinGame = () => {
			router.push({ path: `/game/${gameIdRef}` });
		}

		const onCreateGame = () => {
			createGame(new PublicKey(playerTwoPubKeyRef));
			console.log("Game created");
			router.push({ path: "/game" });
		}

		return { gameIdRef, userWallet, isWalletConnected, onJoinGame, onCreateGame };
	},
};
