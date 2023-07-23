import { computed } from "vue";
import { useAnchorWallet } from "solana-wallets-vue";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import idl from "../idl/tic_tac_toe.json";
import {
	PublicKey,
	Connection,
	clusterApiUrl,
} from "@solana/web3.js";


export const useWorkspace = () => {
	// @ts-ignore
	const IDL: Idl = idl;
	const conn = new Connection(clusterApiUrl("devnet", true), "confirmed");
	const wallet = useAnchorWallet();

	console.log("Wallet data: ");
	console.log(wallet.value);

	console.log("Wallet Connected: ");
	console.log(wallet.value?.publicKey.toBase58());

	const programID = new PublicKey(idl.metadata.address);
	console.log("IDL data:");
	console.log(IDL);

	const preflightCommitment = "processed";
	const commitment = "confirmed";

	const provider = computed(() => {
		return wallet.value
			? new AnchorProvider(conn, wallet.value, {
				preflightCommitment: preflightCommitment,
				commitment: commitment,
			})
			: undefined;
	});

	const program = provider.value ? computed(() => new Program(IDL, programID, provider.value)) : null;

	return {
		wallet,
		conn,
		provider,
		program,
	};
}
