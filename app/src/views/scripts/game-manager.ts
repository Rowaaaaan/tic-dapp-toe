import { useWorkspace, validateProgram } from "../../stores/workspace";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";

import type { TicTacToe } from "../../idl/tic_tac_toe";

const { program } = useWorkspace();
const userWallet = useWallet();

/**
 * Create a game session
 *
 * @param playerTwoPubKey - Public key of player two's wallet
 *
 * @return [string] base58 string of game public key
 * @return null if setting up game fails
 */
const createGame = async (playerTwoPubKey: PublicKey | null) => {
	console.log("Game manager User wallet:");
	console.log(userWallet);
	try {
		validateProgram(program?.value);
		const playerOnePubKey = userWallet.publicKey;
		if (playerOnePubKey.value == null) {
			console.error("Player 1 public key is invalid! Key data:");
			console.log(playerOnePubKey);
			return;
		}
		if (playerTwoPubKey == null) {
			console.error("Player 2 public key is invalid! Key data:");
			console.log(playerTwoPubKey);
			return;
		}

		const gameKeypair = Keypair.generate();
		console.log("Program data:");
		console.log(program);
		await program?.value?.methods
			.setupGame(playerTwoPubKey)
			.accounts({
				game: gameKeypair.publicKey,
				playerOne: (playerOnePubKey.value as PublicKey | undefined),
			})
			.signers([gameKeypair])
			.rpc()
			.then(msg => {
				console.log("Game created! Message:");
				console.log(msg);
			})
			.catch(e => {
				console.error(`Failed to create game! Error: ${e}`);
			});

		return gameKeypair.publicKey.toBase58();
	} catch (e) {
		console.error(`Failed to create game! Error: ${e}`);
		return null;
	}
};

/**
 * Retrieve a game session using a game public key
 *
 * @param [PublicKey] gamePubKey Public key of the game session
 */
const retrieveGameSession = async (gamePubKey: PublicKey) => {
	try {
		let gameState: any = null;
		validateProgram(program?.value);
		gameState = await program?.value?.account.game.fetch(gamePubKey);
		console.log("Game state fetched!");
		console.log(gameState);

		return gameState;
	} catch (e) {
		console.error(`Failed to create game! Error: ${e}`);
		return null;
	}
}

/**
 * Return game manager functions
 *
 * @returns An object of functions
 */
export const useGameManager = () => {
	return {
		createGame,
		retrieveGameSession
	}
};
