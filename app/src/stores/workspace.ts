import { ref, computed } from "vue";
import type { Ref, ComputedRef } from "vue";

import { useAnchorWallet, useWallet } from "solana-wallets-vue";
import type { AnchorWallet } from "solana-wallets-vue";
import type { WalletStore } from "solana-wallets-vue/dist/types";

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
	PublicKey,
	Connection,
	clusterApiUrl,
} from "@solana/web3.js";

import type { TicTacToe } from "../idl/tic_tac_toe";
import idl from "../idl/tic_tac_toe.json";

import {
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { initWallet } from "solana-wallets-vue";

/**
 * Validate if program has data, and the data is valid
 *
 * @throws Error - if program is null, or program data is null
 */
export function validateProgram(program: Program<any> | null | undefined) {
	if (program == null) throw new Error("Program value is null");
	return true;
}

/**
 * Validate if pubkey is valid and contains valid data
 *
 * @throws Error - if public key is null or invalid
 */
export function validatePubKey(pubKey: PublicKey) {
	if (pubKey == null) throw new Error("Invalid public key!");
}

const walletOptions = {
	wallets: [
		new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SlopeWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
	],
	autoConnect: true,
};

let workspace: {
	connection: Connection,
	provider: ComputedRef<AnchorProvider | undefined>,
	program: ComputedRef<Program<TicTacToe> | null>,
	wallet: WalletStore
} | null = null;

/**
 * Create a workspace that initializes the connection, provider, program, and wallet
 * for the game
 */
function createWorkspace() {
	if (workspace != null) return workspace;

	console.log("Creating workspace");
	initWallet(walletOptions);

	let wallet: WalletStore = useWallet();
	console.log("User wallet data")
	console.log(wallet);

	let provider: ComputedRef<AnchorProvider | undefined> = computed(() => undefined);
	let program: ComputedRef<Program<TicTacToe> | null> = computed(() => null);

	// @ts-ignore
	const IDL: TicTacToe = idl;
	const programAddress = process.env.PROGRAM_ADDRESS ?? "CwnZBvhPLva1bSUiunhvatsBAL4o7LspALj1BgQpa3AP";
	const connection = new Connection(clusterApiUrl("devnet", true), "confirmed");
	const programID = new PublicKey(programAddress);

	// Provider wallet is purely for creating a provider, which we need
	// to create the program
	let providerWallet: Ref<AnchorWallet | undefined> = ref(undefined);

	console.log(`Program address: ${programAddress}`);
	console.log("IDL data:");
	console.log(IDL);

	try {
		providerWallet = useAnchorWallet();
		console.log("Provider Wallet data: ");
		console.log(providerWallet.value);
		const preflightCommitment = "processed";
		const commitment = "confirmed";

		provider = computed(() => {
			return providerWallet.value
				? new AnchorProvider(connection, providerWallet.value, {
					preflightCommitment: preflightCommitment,
					commitment: commitment,
				})
				: undefined;
		});

		program = computed(() => provider.value
			? new Program<TicTacToe>(IDL, programID, provider.value)
			: null);

		console.log("Program data:");
		console.log(program);
	} catch (e) {
		console.error(`Failed to get anchorWallet. Error: ${e}`);
	}

	workspace = { connection, provider, program, wallet };
}

/**
 * Return workspace created by createWorkspace()
 *
 * @return [Connection] connection Connection to the network
 * @return [AnchorProvider] provider Provider for transactions
 * @return [Program<T>] program IDL of the RPC program with a provider attached to it
 * @return [WalletStore] wallet Current wallet connected to the webapp
 */
export const useWorkspace = () => {
	createWorkspace();
	const connection = workspace?.connection;
	const provider = workspace ? workspace.provider : computed(() => undefined);
	const program = workspace ? workspace.program : computed(() => undefined);
	const wallet = workspace?.wallet || useWallet();

	return {
		connection,
		provider,
		program,
		wallet
	};
}
