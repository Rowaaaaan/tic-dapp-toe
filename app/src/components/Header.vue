<template>
	<header class="d-flex justify-content-between">
		<div>
			<a href="https://solana.com"><img src="../assets/solanaLogo.png" class="logo rounded" alt="Solana logo"></a>
		</div>
		<div class="d-flex align-items-center">
			<div v-if="isWalletConnected" class="text-light">
				<p class="bal fs-4">{{ walletBalance }} SOL</p>
			</div>
			<div class="d-flex">
				<button class="btn btn-danger m-2" @click="onSendLamportToRandom">
					Send 1 Lamport
				</button>
				<button class="btn btn-primary m-2" @click="onRequestAirdrop">
					Request 1 SOL
				</button>
				<WalletMultiButton />
			</div>
		</div>
	</header>
</template>

<script src="./scripts/header.ts" lang="ts" />

<style scoped>
header {
	padding: 20px;
	height: 12vh;
	width: 100vw;
	background: #272528;
}

header>button {
	height: 3rem;
	width: 15rem;
}

.logo {
	height: 100%;
	width: 20%;
	object-fit: contain;
}

.bal {
	width: 5rem;
	justify-self: center;
}
</style>
