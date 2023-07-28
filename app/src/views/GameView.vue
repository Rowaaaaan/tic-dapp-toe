<template>
	<main class="d-flex justify-content-center">
		<div class="d-flex flex-wrap align-items-center justify-content-center game-wrapper">
			<div class="board d-flex flex-column justify-content-center align-items-center">
				<div v-for="row of board.rows" class="row">
					<div v-for="tile of row" :key="tile" class="tile col d-flex justify-content-center align-items-center"
						@click="onSetTile(tile)">
						<p>{{ tile.value }}</p>
					</div>
				</div>
			</div>
			<div class="game-stats d-flex flex-column justify-content-center border border-2 border-dark rounded-3 p-3">
				<button class="btn btn-warning" @click="onRefreshBoard">Refresh board</button>
				<div class="d-flex justify-content-between">
					<p class="fw-bold">Game ID:</p>
					<p>{{ gameId }}</p>
				</div>
				<div class="d-flex justify-content-between">
					<p class="fw-bold">Turn number:</p>
					<p>{{ turn }}</p>
				</div>
				<div class="d-flex justify-content-between">
					<p class="fw-bold">Player 1 [X]:</p>
					<p>{{ playerOnePubKey }}</p>
				</div>
				<div class="d-flex justify-content-between">
					<p class="fw-bold">Player 2 [O]:</p>
					<p>{{ playerTwoPubKey }}</p>
				</div>
				<div v-if="winner != null">
					<p class="fs-2 fw-bold">
						{{ playerOneWin ? "Player 1" :
							"Player 2" }}
						wins!
					</p>
				</div>
				<div v-else class="d-flex justify-content-between">
					<p class="fw-bold">
						{{ playerTurn ? "Your turn" : "Opponent's turn" }}
					</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script src="./scripts/game.ts" lang="ts" />

<style scoped>
.board {
	height: 550px;
	width: 500px;
}

.tile {
	border: 1px solid;
	height: 150px;
	width: 150px;
}

.tile p {
	font-size: 5rem;
}

.tile .player-one {
	color: blue;
}

.tile .player-two {
	color: red;
}

.tile:hover {
	cursor: pointer;
}
</style>
