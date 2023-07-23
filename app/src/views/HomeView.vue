<template>
	<div class="app-wrapper d-flex flex-column align-items-center">
		<h1>Play Tic Dapp Toe</h1>
		<div v-if="!isWalletConnected">
			<p class="text-xl-b">Connect Wallet to continue</p>
		</div>
		<h2 class="text-center">Open games:</h2>
		<div v-if="openGames.length > 0" class="open-games-list">
			<div v-for="game in openGames" class="game d-flex flex-column p-2 m-2">
				<div class="d-flex justify-content-between">
					<p>{{ game.hash }}</p>
					<button class="btn btn-primary" @click="onJoinGame">Join Game</button>
				</div>
			</div>
		</div>
		<div v-else>
			<p class="fs-3">There are currently no open games</p>
		</div>
		<div>
			<button class="btn btn-success" @click="onCreateGame">Create New Game</button>
		</div>
	</div>
</template>

<script src="./scripts/home.ts" lang="ts" />

<style scoped>
.open-games-list {
	min-width: 30vw;
}

.game {
	border: 2px solid black;
	border-radius: 5px;
	justify-content: center;
}
</style>
