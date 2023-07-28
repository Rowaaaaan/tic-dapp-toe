import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TicTacToe } from "../target/types/tic_tac_toe";
import { PublicKey, Keypair } from "@solana/web3.js";
import { expect } from "chai";

interface Tile {
	row: number;
	column: number;
};

async function play(
	program: Program<TicTacToe>,
	game: PublicKey,
	player: any,
	tile: Tile,
	expectedTurn: number,
	expectedGameState: {},
	expectedBoard: Array<Array<{}>>
) {
	console.log(player);
	await program.methods
		.play(tile)
		.accounts({
			player: player.publicKey,
			game,
		})
		.signers(player instanceof (anchor.Wallet as any) ? [] : [player])
		.rpc()


	const gameState = await program.account.game.fetch(game)
	console.log("Game state");
	console.log(gameState);
	expect(gameState.turn).to.equal(expectedTurn)
	expect(gameState.state).to.eql(expectedGameState)
	expect(gameState.board).to.eql(expectedBoard)
}

describe("tic-tac-toe", () => {
	// Configure the client to use the local cluster.
	anchor.setProvider(anchor.AnchorProvider.env());

	const program = anchor.workspace.TicTacToe as Program<TicTacToe>;
	console.log(program);
	const gameKeypair = anchor.web3.Keypair.generate();
	const playerOne = (program.provider as anchor.AnchorProvider).wallet;
	const playerTwo = anchor.web3.Keypair.generate();
	console.log("Provider data");
	console.log(program.provider);

	it("setup game!", async () => {
		await program.methods
			.setupGame(playerTwo.publicKey)
			.accounts({
				game: gameKeypair.publicKey,
				playerOne: playerOne.publicKey,
			})
			.signers([gameKeypair])
			.rpc();

		let gameState = await program.account.game.fetch(gameKeypair.publicKey);
		console.log(`Game keypair: ${gameKeypair}`);
		expect(gameState.turn).to.equal(1);
		expect(gameState.players).to.eql([
			playerOne.publicKey,
			playerTwo.publicKey,
		]);
		expect(gameState.state).to.eql({ active: {} });
		expect(gameState.board).to.eql([
			[null, null, null],
			[null, null, null],
			[null, null, null],
		]);
	});

	it('player one wins', async () => {
		const gameKeypair = anchor.web3.Keypair.generate()
		const playerOne = (program.provider as anchor.AnchorProvider).wallet
		const playerTwo = anchor.web3.Keypair.generate()
		await program.methods
			.setupGame(playerTwo.publicKey)
			.accounts({
				game: gameKeypair.publicKey,
				playerOne: playerOne.publicKey,
			})
			.signers([gameKeypair])
			.rpc();


		console.log(`Game session keypair: ${gameKeypair.publicKey}`);
		let gameState = await program.account.game.fetch(gameKeypair.publicKey);
		expect(gameState.turn).to.equal(1)
		expect(gameState.players).to.eql([playerOne.publicKey, playerTwo.publicKey])
		expect(gameState.state).to.eql({ active: {} })
		expect(gameState.board).to.eql([
			[null, null, null],
			[null, null, null],
			[null, null, null],
		])


		await play(
			program,
			gameKeypair.publicKey,
			playerOne,
			{ row: 0, column: 0 },
			2,
			{ active: {} },
			[
				[{ x: {} }, null, null],
				[null, null, null],
				[null, null, null],
			]
		);

		await play(
			program,
			gameKeypair.publicKey,
			playerTwo,
			{ row: 0, column: 1 },
			3,
			{ active: {} },
			[
				[{ x: {} }, null, null],
				[null, null, null],
				[null, null, null],
			]
		);
	})
});
