import { ref, watch, onMounted } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { useWorkspace, validateProgram } from "../../stores/workspace";

import { useGameManager } from "./game-manager";
import { Board, Tile } from "./game-objects";

const { program, provider, wallet } = useWorkspace();
const { retrieveGameSession } = useGameManager();

export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const gameId = route.params.gameId as string;
		let gamePubKey: PublicKey;
		const gameState: Ref<any> = ref();

		// Check if a public key can be generated from the game id passed in
		try {
			gamePubKey = new PublicKey(gameId);

		} catch (e) {
			console.error(`Game ID: ${gameId}`);
			console.error(`Error getting pubkey from game id. Error: ${e}`);
			router.push({ name: "GameNotFound" });
		}

		// Get the keys as a Uint8Array to be able to convert it to a string.
		// Otherwise, the comparison will fail for some reason.
		const playerOnePubKey: Ref<Uint8Array | null> = ref(null);
		const playerTwoPubKey: Ref<Uint8Array | null> = ref(null);
		const winner: Ref<Uint8Array | null> = ref(null);
		const turn: Ref<number> = ref(0);
		const playerTurn: Ref<boolean> = ref(false);
		const playerOneWin: Ref<boolean> = ref(false);
		watch(gameState, () => {
			updateBoardState();
			playerOnePubKey.value = gameState.value?.players[0] as Uint8Array;
			playerTwoPubKey.value = gameState.value?.players[1] as Uint8Array;
			winner.value = gameState.value?.state.won?.winner as Uint8Array;
			turn.value = gameState.value?.turn;
			playerTurn.value = (playerPubKey.value?.toString() === playerOnePubKey.value.toString())
				? (turn.value % 2 === 1)
				: (turn.value % 2 === 0);
			playerOneWin.value = (playerOnePubKey.value?.toString() === winner.value?.toString());
		});

		onMounted(async () => {
			useWorkspace();
			gameState.value = await retrieveGameSession(gamePubKey);
			console.log("GameView component mounted");
		});

		let playerWallet: anchor.AnchorProvider = (program?.value?.provider as anchor.AnchorProvider);
		const playerPubKey: Ref<PublicKey | null> = wallet.publicKey;
		const setPlayerWalletData = () => {
			try {
				playerWallet = (program?.value?.provider as anchor.AnchorProvider);
				console.log("Player wallet data");
				console.log(playerWallet);
			} catch (e) {
				console.log(`Failed to get provider wallet. Error: ${e}`);
			}
		};

		watch(program, async () => {
			setPlayerWalletData();
			gameState.value = await retrieveGameSession(gamePubKey);
			updateBoardState();
		});

		watch(provider, () => {
			console.log("Provider changed!");
			console.log(provider);
		})

		const board: Ref<Board> = ref(new Board());

		// Horribly inefficient method of updating board state from RPC data
		const updateBoardState = () => {
			try {
				console.log("Tile states");
				let x = 0;
				let y = 0;
				for (let row of gameState.value.board) {
					y = 0;
					for (let tile of row) {
						if (tile != null) {
							if (tile.o != null) {
								board.value.setTile("O", { x, y });
							} else if (tile.x != null) {
								board.value.setTile("X", { x, y });
							}
						}
						y++;
					}
					x++;
				}
			} catch (e) {
				console.log(`Failed to get tile states. Error: ${e}`)
			}
		}

		const updateGameState = async () => {
			let returnState: any;
			try {
				validateProgram(program?.value);
				await program?.value?.account.game.fetch(gamePubKey)
					.then((state) => {
						returnState = state;
					})
					.catch((e) => {
						console.error(`Failed to get game state. Error: ${e}`);
					});
			} catch (e) {
				console.log(`Failed to update game state. Error ${e}`);
			}
			return returnState;
		}

		const setTile = async (tile: Tile) => {
			try {
				validateProgram(program?.value);
				if (playerPubKey.value == null) return;
				console.log("Player wallet data");
				console.log(playerWallet);
				program?.value?.methods
					.play({ row: tile.row, column: tile.column })
					.accounts({
						player: playerPubKey.value,
						game: gamePubKey
					})
					.signers(playerWallet ? [] : [playerWallet])
					.rpc()
					.then(txHash => {
						console.log(`Tile set! Hash: ${txHash}`);
						updateGameState();
					})
					.catch(e => {
						console.log(`Failed to set tile. Error: ${e}`);
					});
			} catch (e) {
				console.log(`Failed to set tile. Error: ${e}`);
			}
		};

		const onSetTile = async (tile: Tile) => {
			if (playerWallet == null) {
				setPlayerWalletData();
			}
			setTile(tile);
		};

		const onRefreshBoard = () => {
			updateBoardState();
		};

		return {
			playerPubKey,
			playerOnePubKey,
			playerTwoPubKey,
			playerOneWin,
			playerTurn,
			winner,
			gameId,
			turn,
			board,
			onSetTile,
			onRefreshBoard
		};
	},
};
