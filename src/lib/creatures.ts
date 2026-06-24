import { getDistance, type Vector2 } from './vector2'
import { AnimatedSprite } from 'pixi.js'
import { addSprite, getTexture } from './sprites'
import { EntityMap, Level } from './level'
import { RNG } from 'rot-js'
import { isWet, type TileData } from './map'
import { addEntity } from './entity'
import { EntitySprites } from './pixi'

export enum Creature {
	Fish = 1,
	Alligator,
	Turtle,
	GiantSnail,
	Crayfish,
}

export const CreatureProps: {
	texture: string
}[] = []
CreatureProps[Creature.Fish] = {
	texture: 'fish',
}
CreatureProps[Creature.Crayfish] = {
	texture: 'crayfish',
}
CreatureProps[Creature.Alligator] = {
	texture: 'alligator',
}
CreatureProps[Creature.Turtle] = {
	texture: 'turtle',
}
CreatureProps[Creature.GiantSnail] = {
	texture: 'giantSnail',
}

export function createWaterCreature(grid: Vector2, rng: typeof RNG) {
	createCreature(
		grid,
		<Creature>(<unknown>rng.getWeightedValue({
			[Creature.Alligator]: 1,
			[Creature.Fish]: 5,
			[Creature.Crayfish]: 3,
		})),
		true
	)
}

export function createGiantSnails(playerSpawn: Vector2, rng: typeof RNG) {
	const openTiles = [...Level.data.values()].filter((t) => !t.solid)
	const snailCount = rng.getUniformInt(
		...(<[number, number]>[
			[1, 2],
			[2, 5],
			[4, 8],
		][0])
	)
	for (let i = 0; i < snailCount; i++) {
		let tile: TileData
		do {
			tile = rng.getItem(openTiles)!
		} while (
			isWet(tile.type) ||
			tile.solid ||
			EntityMap.has(tile) ||
			getDistance(tile, playerSpawn) < 12
		)
		createCreature(tile, Creature.GiantSnail)
	}
}

export function createTurtle(playerSpawn: Vector2, minimumDistance: number, rng: typeof RNG) {
	const openTiles = [...Level.data.values()].filter((t) => !t.solid)
	let tile: TileData
	do {
		tile = rng.getItem(openTiles)!
	} while (EntityMap.has(tile) || getDistance(tile, playerSpawn) < minimumDistance)
	createCreature(tile, Creature.Turtle, isWet(tile.type))
}

function createCreature(grid: Vector2, creatureType: Creature, spawnInWater = false) {
	const creature = addEntity()
	const creatureSprite = changeAnimation(null, creatureType, spawnInWater)
	addSprite(creature, creatureSprite, EntitySprites, grid.x, grid.y)
}

export function changeAnimation(
	sprite: AnimatedSprite | null,
	creatureType: Creature,
	swim = false
): AnimatedSprite {
	const creatureProps = CreatureProps[creatureType]
	const textures = swim
		? [1, 2, 3].map((n) => ({ texture: getTexture(creatureProps.texture + 'Swim' + n), time: 400 }))
		: [getTexture(creatureProps.texture)]
	if (sprite === null) {
		sprite = new AnimatedSprite(textures)
	} else {
		sprite.textures = textures
	}
	if (!sprite.playing) sprite.play()
	return sprite
}
