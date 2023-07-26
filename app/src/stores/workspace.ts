import { computed } from "vue";
import type { Ref } from "vue";

import { useWallet, useAnchorWallet, initWallet } from "solana-wallets-vue";
import type { AnchorWallet } from "solana-wallets-vue";
import type { WalletStore } from "solana-wallets-vue/dist/types";

import { AnchorProvider, Program } from "@coral-xyz/anchor";
import {
	PublicKey,
	Connection,
	clusterApiUrl,
} from "@solana/web3.js";

import {
	PhantomWalletAdapter,
	SlopeWalletAdapter,
	SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

import type { TicTacToe } from "../idl/tic_tac_toe";
import idl from "../idl/tic_tac_toe.json";

const walletOptions = {
	wallets: [
		new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SlopeWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
		new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
	],
	autoConnect: true,
};

export const useWorkspace = () => {
	// @ts-ignore
	const IDL: TicTacToe = idl;
	const programAddress = process.env.PROGRAM_ADDRESS ?? "CwnZBvhPLva1bSUiunhvatsBAL4o7LspALj1BgQpa3AP";
	console.log(`Program address: ${programAddress}`);
	const conn = new Connection(clusterApiUrl("devnet", true), "confirmed");

	// Provider wallet is purely for creating a provider, which we need
	// to create the program
	const providerWallet: Ref<AnchorWallet | undefined> = useAnchorWallet();

	// useWallet() is better for using in UI
	const userWallet: WalletStore = useWallet();

	console.log("User wallet data: ");
	console.log(userWallet);

	console.log("Provider Wallet data: ");
	console.log(providerWallet);

	const programID = new PublicKey(programAddress);
	console.log("IDL data:");
	console.log(IDL);

	const preflightCommitment = "processed";
	const commitment = "confirmed";

	const provider = computed(() => {
		return providerWallet.value
			? new AnchorProvider(conn, providerWallet.value, {
				preflightCommitment: preflightCommitment,
				commitment: commitment,
			})
			: undefined;
	});

	const program = provider.value ? computed(() => new Program<TicTacToe>(IDL, programID, provider.value)) : null;

	return {
		userWallet,
		conn,
		provider,
		program,
	};
}
