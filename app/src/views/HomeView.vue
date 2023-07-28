<template>
	<div class="app-wrapper d-flex flex-column align-items-center justify-content-center">
		<h1>Play Tic Dapp Toe</h1>
		<div v-if="!isWalletConnected">
			<p class="text-xl-b">Connect Wallet to continue</p>
		</div>
		<div class="d-flex flex-column">
			<p class="fs-3">To join game, enter game public key:</p>
			<div class="d-flex flex-row">
				<input v-model="gameIdRef" class="game-key-input" placeholder="Game public key here" @enter="onJoinGame" />
				<button class="btn btn-primary m-2" @click="onJoinGame">Join</button>
			</div>
			<div class="d-flex flex-column">
				<p class="fs-3 text-center">Or</p>
				<p class="fs-3 text-center">Create Game</p>
				<div class="d-flex justify-content-between">
					<input v-model="playerTwoPubKeyRef" class="game-key-input" placeholder="Player 2 public key here" />
					<button class="btn btn-success m-2" @click="onCreateGame">Create</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script src="./scripts/home.ts" lang="ts" />

<style scoped>
.app-wrapper {
	height: 88vh;
	width: 100vw;
}

.open-games-list {
	min-width: 30vw;
}

.game {
	border: 2px solid black;
	border-radius: 5px;
	justify-content: center;
}

.game-key-input {
	width: 25rem;
}
</style>
