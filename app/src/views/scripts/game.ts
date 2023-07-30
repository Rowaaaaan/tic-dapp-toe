import { ref, watch, onMounted } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

import { useWorkspace, validateProgram, validatePubKey } from "../../stores/workspace";

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
		const notice: Ref<string | null> = ref(null);

		onMounted(async () => {
			// Check if a public key can be generated from the game id passed in
			try {
				useWorkspace();
				gamePubKey = new PublicKey(gameId);
				gameState.value = await retrieveGameSession(gamePubKey);
				console.log("GameView component mounted");
			} catch (e) {
				console.error(`Game ID: ${gameId}`);
				console.error(`Error getting pubkey from game id. Error: ${e}`);
				router.push({ name: "GameNotFound" });
			}
		});

		// Get the keys as a Uint8Array to be able to convert it to a string.
		// Otherwise, the comparison will fail for some reason.
		const playerOnePubKey: Ref<Uint8Array | null> = ref(null);
		const playerTwoPubKey: Ref<Uint8Array | null> = ref(null);
		const winner: Ref<Uint8Array | null> = ref(null);
		const turn: Ref<number> = ref(0);
		const playerTurn: Ref<boolean> = ref(false);
		const playerOneWin: Ref<boolean> = ref(false);
		const gameOverState: Ref<string | null> = ref(null);
		watch(gameState, () => {
			console.log("Game state changed!");
			updateBoardState();
			try {
				gameOverState.value = (gameState.value?.state != undefined && gameState.value?.state.active == undefined)
					? gameState.value?.state.won != undefined
						? "won" : "tie"
					: null;
				playerOnePubKey.value = gameState.value?.players[0] as Uint8Array;
				playerTwoPubKey.value = gameState.value?.players[1] as Uint8Array;
				winner.value = gameState.value?.state.won?.winner as Uint8Array;
				turn.value = gameState.value?.turn;
				playerTurn.value = (playerPubKey.value?.toString() === playerOnePubKey.value.toString())
					? (turn.value % 2 === 1)
					: (turn.value % 2 === 0);
				playerOneWin.value = (playerOnePubKey.value?.toString() === winner.value?.toString());
			} catch (e) {
				console.log(`Failed to update game state. Error: ${e}`);
			}
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
				if (gameState.value == null) {
					gameState.value = updateGameState();
				}

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
				console.log("Board State");
				console.log(board.value.rows);
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
						gameState.value = state;
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

		const setTile = async (tile: Tile): Promise<string | undefined | null> => {
			try {
				// Throws an error if either condition fails
				validateProgram(program?.value);
				validatePubKey(playerPubKey.value);

				console.log("Player wallet data");
				console.log(playerWallet);
				program?.value?.methods
					.play({ row: tile.row, column: tile.column })
					.accounts({
						player: playerPubKey.value || undefined,
						game: gamePubKey
					})
					.signers(playerWallet ? [] : [playerWallet])
					.rpc()
					.then(txHash => {
						console.log(`Tile set! Hash: ${txHash}`);
						updateGameState();
						return txHash;
					})
					.catch(e => {
						console.error(`Failed to set tile. Error: ${e}`);
					});
			} catch (e) {
				notice.value = `Failed to set tile. Error: ${e}`;
				return null;
			}
		};

		const lastTxHash: Ref<string | undefined | null> = ref(null);
		const onSetTile = async (tile: Tile) => {
			if (playerWallet == null) {
				notice.value = "Wallet data is null. Trying to get data from connected wallet...";
				setPlayerWalletData();
			}
			else {
				lastTxHash.value = await setTile(tile);
				console.log(`Last TX hash: ${lastTxHash.value || 'none'}`);
			}
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
			gameOverState,
			gameId,
			turn,
			board,
			onSetTile,
			onRefreshBoard,
			notice,
			lastTxHash,
		};
	},
};
