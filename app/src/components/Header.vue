<template>
	<header class="d-flex justify-content-between">
		<div class="logo align-self-center">
			<RouterLink :to="{ path: '/' }">
				<h1>Home</h1>
			</RouterLink>
		</div>
		<div class="d-flex flex-end align-items-center">
			<div v-if="isWalletConnected" class="d-flex text-light">
				<p class="bal fs-5">{{ walletBalance }} SOL</p>
			</div>
			<div class="wallet-btn-group d-flex">
				<button class="btn btn-danger m-2" @click="onSendLamportToRandom">
					Test Send
				</button>
				<button class="btn btn-primary my-2" @click="onRequestAirdrop">
					Request 1 SOL
				</button>
				<div class="btn-wallet align-self-center m-2">
					<WalletMultiButton />
				</div>
			</div>
		</div>
	</header>
</template>

<script lang="ts" src="./scripts/header" />


<style scoped>
@media (max-width: 700px) {
	.logo {
		display: none;
	}
}

.btn-wallet {
	margin-right: 1rem;
}

header {
	padding: 20px;
	min-height: 75px;
	height: 12vh;
	width: 100vw;
	background: #272528;
}

header button {
	margin: 0;
	height: 3rem;
	width: 9rem;
}

.logo {
	height: 100%;
	width: 20%;
	object-fit: contain;
}

.bal {
	min-width: 5rem;
	justify-self: center;
}
</style>
