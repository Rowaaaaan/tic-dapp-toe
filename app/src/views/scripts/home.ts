import { onMounted, watch, ref } from "vue";
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
		const notice: Ref<string | null> = ref(null);

		const router = useRouter();
		let { wallet, provider, program } = useWorkspace();

		const isWalletConnected: Ref<boolean> = wallet?.connected || ref(false);
		watch(isWalletConnected, () => {
			console.log("Wallet Data updated! Data: ");
			console.log(wallet);
			console.log("Wallet connected: ");
			console.log(isWalletConnected.value);
		})

		watch(provider, () => {
			console.log("Provider changed!");
			console.log(provider);
		})

		watch(program, () => {
			console.log("Program data changed!");
			console.log(program);
		})

		const onJoinGame = () => {
			router.push({ path: `/game/${gameIdRef.value}` });
		}

		const onCreateGame = async () => {
			if (provider.value?.wallet == null) {
				notice.value = "Wallet of game creator is null!";
				return;
			}
			let playerTwoPubKey: PublicKey;
			try {
				console.log(`Player two pubkey: ${playerTwoPubKeyRef.value}`);
				playerTwoPubKey = new PublicKey(playerTwoPubKeyRef.value);
				await createGame(playerTwoPubKey)
					.then(gameId => {
						console.log("Game created");
						router.push({ path: `/game/${gameId}` });
					})
					.catch(e => {
						console.error(`Failed to create game! Error: ${e}`);
					});
			} catch (e) {
				console.error(`Failed to create public key! Error: ${e}`);
			}

		}

		return { gameIdRef, playerTwoPubKeyRef, userWallet: wallet, isWalletConnected, onJoinGame, onCreateGame };
			notice,
	},
};
