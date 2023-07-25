import { useWorkspace } from "../../stores/workspace";
import { Keypair, PublicKey } from "@solana/web3.js";

const { program, userWallet } = useWorkspace();

const createGame = async (playerTwoPubKey: PublicKey | null) => {
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
	await program?.value.methods
		.setupGame(playerTwoPubKey)
		.accounts({
			game: gameKeypair.publicKey,
			playerOne: (playerOnePubKey.value as PublicKey | undefined),
		})
		.signers([gameKeypair])
		.rpc();

	return gameKeypair;
};

export const useGameManager = () => {
	return {
		createGame,
	}
};
