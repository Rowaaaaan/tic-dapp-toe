<template>
	<main class="d-flex justify-content-center">
		<div class="container game-wrapper">
			<div v-for="row in board.rows" class="row">
				<div v-for="tile in row" class="tile col d-flex justify-content-center align-items-center"
					@click="setTile(tile)">
					<p :class="playerOneTurn ? 'player-one' : 'player-two'">{{ tile.value }}</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script src="./scripts/game.ts" lang="ts" />

<style scoped>
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
