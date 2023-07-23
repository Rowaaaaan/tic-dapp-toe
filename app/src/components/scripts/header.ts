import { ref, defineComponent, onMounted } from "vue";
import { Keypair, SystemProgram, Transaction, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import { WalletMultiButton } from 'solana-wallets-vue';

import { Connection, clusterApiUrl } from '@solana/web3.js';

async function sendOneLamportToRandomAddress(wallet: WalletStore, connection: Connection) {
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
		.then((signature) => connection.confirmTransaction(signature, 'processed')
			.then(msg => console.log(`Transaction confirmed. ${msg}`))
			.catch(e => console.error(`Transaction failed. Error: ${e}`)))
		.catch(e => console.error(`Failed to send lamport. Error: ${e}`));
}

async function requestAirdrop(wallet: WalletStore, connection: Connection) {
	console.log("1 SOL Airdrop requested");
	const { publicKey } = wallet;
	connection.requestAirdrop(publicKey.value, 1)
		.then((signature) => connection.confirmTransaction(signature, 'processed')
			.then(msg => console.log("Airdrop successful. Response: ${msg}"))
			.catch(e => console.error(`Failed to confirm transaction. Error: ${e}`)))
		.catch(e => console.error(`Airdrop failed. Error: ${e}`));
}

async function getBalance(wallet: WalletStore, connection: Connection): Promise<number> {
	const { publicKey } = wallet;
	const balance: number | void = await connection.getBalance(publicKey)
		.catch(e => console.log(`Error getting balance: ${e}`));
	return balance ? balance : 0;
}

export default defineComponent({
	components: {
		WalletMultiButton,
	},
	setup() {
		const wallet = useWallet();
		const connection = new Connection(clusterApiUrl('devnet'))
		const walletBalance: Ref<number> = ref(0);
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
