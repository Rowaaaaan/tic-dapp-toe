<template>
	<main class="d-flex flex-column align-items-center justify-content-center">
		<h1>Game Not Found :(</h1>
		<RouterLink :to="{ name: 'home' }">Go Home</RouterLink>
	</main>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<style scoped>
main {
	height: 80vh;
	width: 100vw;
}
</style>
