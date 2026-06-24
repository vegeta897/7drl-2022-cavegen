<script lang="ts">
	import { worldInfo } from '$lib/store.svelte'
	import { onMount } from 'svelte'

	let mainDiv: HTMLDivElement

	let pixi: typeof import('$lib/pixi')
	let level: typeof import('$lib/level')

	let loading = $state(true)

	onMount(async () => {
		pixi = await import('$lib/pixi')
		await pixi.initPixi(mainDiv)
		level = await import('$lib/level')
		await level.createLevel(1)
		loading = false
	})

	async function randomize() {
		loading = true
		pixi.resetPixi()
		await level.createLevel(1)
		loading = false
	}
</script>

<div class="p-4">
	<div class="p-4 flex flex-col items-center gap-4 sm:flex-row">
		<button
			onclick={randomize}
			type="button"
			disabled={loading}
			class:opacity-50={loading}
			class="rounded-lg bg-cyan-800 text-white px-3 py-2 font-bold hover:bg-cyan-600"
		>
			Randomize
		</button>
		<input class="text-black w-32" type="number" bind:value={worldInfo.seed} />
		{#if !loading}
			<p class="opacity-50">Seed: {worldInfo.seed}</p>
			<p class="opacity-50">Attempts: {worldInfo.generationAttempts}</p>
		{/if}
	</div>
	<div bind:this={mainDiv} class="py-2"></div>
	<a
		href="https://vegeta897.itch.io/hook-line-and-spelunker"
		class="text-cyan-300 hover:opacity-100 opacity-70">Play the game on itch.io</a
	>
</div>
