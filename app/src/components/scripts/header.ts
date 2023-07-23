import { ref, defineComponent, onMounted } from "vue";
import { Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { WalletMultiButton } from 'solana-wallets-vue';
import type { WalletStore } from 'solana-wallets-vue/dist/types';

import { Connection, clusterApiUrl } from '@solana/web3.js';

async function sendOneLamportToRandomAddress(wallet: any, connection: Connection) {
	console.log("Transfer 1 lamport requested");
	const { publicKey, sendTransaction } = wallet;
	if (!publicKey.value) return;

	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: publicKey.value,
			toPubkey: Keypair.generate().publicKey,
			lamports: 1,
		})
	);

	sendTransaction(transaction, connection)
		.then((signature: string) => connection.confirmTransaction(signature, 'processed')
			.then(msg => console.log(`Transaction confirmed. ${msg}`))
			.catch(e => console.error(`Transaction failed. Error: ${e}`)))
		.catch((e: any) => console.error(`Failed to send lamport. Error: ${e}`));
}

async function requestAirdrop(wallet: WalletStore, connection: Connection) {
	const { publicKey } = wallet;
	console.log(`1 SOL Airdrop requested for public key: ${publicKey.value}`);

	publicKey.value ? connection.requestAirdrop(publicKey.value, 1 * LAMPORTS_PER_SOL)
		.then((signature) => connection.confirmTransaction(signature, 'processed')
			.then(msg => {
				console.log("Airdrop successful. Response: ");
				console.log(msg);
			})
			.catch(e => console.error(`Failed to confirm transaction. Error: ${e}`)))
		.catch(e => console.error(`Airdrop failed. Error: ${e}`))
		: console.error("Public key is invalid!");
}

async function getBalance(wallet: WalletStore, connection: Connection): Promise<number> {
	const { publicKey } = wallet;

	if (publicKey.value === null) {
		console.error("Public key is invalid or null!");
		return 0;
	}

	const balance: number | void = publicKey.value ? await connection.getBalance(publicKey.value)
		.catch(e => console.log(`Error getting balance: ${e}`))
		: 0;
	return balance ? balance : 0;
}

export default defineComponent({
	components: {
		WalletMultiButton,
	},
	setup() {
		const wallet: WalletStore = useWallet();
		const connection = new Connection(clusterApiUrl('devnet'))
		const walletBalance = ref(0);
		// onMounted(() => {
		// 	setInterval(() => {
		// 		getBalance(wallet, connection).then((bal) => {
		// 			if (typeof bal === 'number') walletBalance.value = bal;
		// 		}, 5000);
		// 	})
		// });
		const isWalletConnected = ref(true);

		const onSendLamportToRandom = () => {
			sendOneLamportToRandomAddress(wallet, connection);
		};

		const onRequestAirdrop = () => {
			requestAirdrop(wallet, connection);
		};

		return {
			walletBalance,
			onSendLamportToRandom,
			onRequestAirdrop,
			isWalletConnected
		};
	},
});
