export let worldInfo = $state({
	generationAttempts: 0,
	seed: 0,
})

export function incrementLevelGenAttempts() {
	worldInfo.generationAttempts++
}

export function resetLevelGenAttempts() {
	worldInfo.generationAttempts = 0
}

export function setSeed(seed: number) {
	worldInfo.seed = seed
}
