import { ref, defineComponent, onMounted } from "vue";

import {
	SystemProgram,
	Transaction,
	PublicKey,
	Connection,
	clusterApiUrl,
	LAMPORTS_PER_SOL
} from "@solana/web3.js";

import { useWorkspace } from "../../stores/workspace";
import { WalletMultiButton } from 'solana-wallets-vue';
import type { WalletStore } from 'solana-wallets-vue/dist/types';
import type { Ref } from "vue";

async function sendOneLamportToRandomAddress(wallet: WalletStore, connection: Connection) {
	const { publicKey, sendTransaction } = wallet;
	console.log(`Transfer 0.01 SOL requested by ${publicKey.value}`);
	if (!publicKey.value) return;

	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: publicKey.value,
			toPubkey: Keypair.generate().publicKey,
			lamports: 0.01 * LAMPORTS_PER_SOL,
		})
	);

	sendTransaction(transaction, connection)
		.then((signature: string) => {
			connection.confirmTransaction(signature, 'processed');
			console.log(`Transaction confirmed! Hash: ${signature}`);
		})
		.then(msg => {
			console.log(`Block details`)
			console.log(msg);
		})
		.catch(e => console.error(`Transaction failed. Error: ${e}`))
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

function truncateDecimals(num: number, digits: number) {
	const multiplier = Math.pow(10, digits),
		adjustedNum = num * multiplier,
		truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

	return truncatedNum / multiplier;
};
async function getBalance(wallet: WalletStore, connection: Connection): Promise<number> {
	const { publicKey } = wallet;

	if (publicKey.value === null) {
		console.error("Public key is invalid or null!");
		return 0;
	}

	let balance: number | void = 0;

	try {
		balance = publicKey.value ? await connection.getBalance(publicKey.value)
			.catch(e => console.log(`Error getting balance: ${e}`))
			: 0;
		console.log(`Public key [${publicKey.value}] balance: ${balance}`)
	} catch (e) {
		console.error(`Failed to get balance. Error: ${e}`);
	}

	return balance ? truncateDecimals(balance / LAMPORTS_PER_SOL, 2) : 0;
}

export default defineComponent({
	components: {
		WalletMultiButton,
	},
	setup() {
		const { wallet } = useWorkspace();
		const connection = new Connection(clusterApiUrl('devnet'))
		const walletBalance = ref(0);
		onMounted(() => {
			setInterval(async () => {
				walletBalance.value = await getBalance(wallet, connection);
			}, 10000);
		});
		const isWalletConnected: Ref<boolean> = wallet.connected;

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
