import { ref } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PublicKey, PUBLIC_KEY_LENGTH } from "@solana/web3.js";
import base58 from "bs58";

import { useWorkspace } from "../../stores/workspace";
import { Board, Tile } from "./game-objects";

const { program } = useWorkspace();


export default {
	setup() {
		const route = useRoute();
		const router = useRouter();

		const gameId = route.params.gameId as string;
		let gamePubKey: PublicKey;

		try {
			gamePubKey = new PublicKey(gameId);
		} catch (e) {
			router.push({ name: "GameNotFound" });
			console.error(`Game ID: ${gameId}`);
			console.error(`Error getting pubkey from game id. Error: ${e}`);
		}

		const gameState: Ref<any> = ref(null);
		const updateGameState = async () => {
			if (program == null) {
				console.error("Game Program or provider does not exist");
				return;
			}
			await program?.value.account.game.fetch(gamePubKey)
				.then((state) => {
					gameState.value = state;
				})
				.catch((e) => {
					console.error(`Failed to get game state. Error: ${e}`);
				});
		}

		const board: Ref<Board> = ref(new Board());
		const updateBoardState = () => {
			board.value ??= gameState.value.board;
			console.log(board.value);
		}

		const setTile = (tile: Tile) => {
			console.log(tile);
			program?.value.methods.play({ row: tile.x, column: tile.y });
		};

		const onSetTile = (tile: Tile) => {
			setTile(tile);
			updateGameState();
			updateBoardState();
		};

		return { gameId, board, onSetTile };
	},
};
