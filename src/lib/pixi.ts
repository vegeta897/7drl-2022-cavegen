import * as PIXI from 'pixi.js'
import { Application, Container, Loader } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { initTextures } from './sprites'

const gameWidth = 1156
const gameHeight = 720

export let PixiApp: Application

export let PixiViewport: Viewport

export let WorldSprites: Container
export let EntitySprites: Container

export async function initPixi(root: HTMLDivElement) {
	PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST
	PIXI.settings.ROUND_PIXELS = true
	PixiApp = new Application({
		backgroundColor: 0x221e3a,
		// width: gameWidth,
		// height: gameHeight,
	})
	PixiViewport = new Viewport({
		// screenWidth: gameWidth,
		// screenHeight: gameHeight,
		threshold: 3,
	})
	PixiViewport.drag({ wheel: false })
	PixiViewport.setZoom(1)
	PixiApp.stage.addChild(PixiViewport)
	await loadGameAssets()
	initTextures() // Create Textures
	resetPixi()
	root.appendChild(PixiApp.view)
}

export function resetPixi() {
	WorldSprites?.destroy({ children: true })
	EntitySprites?.destroy({ children: true })
	WorldSprites = new Container()
	EntitySprites = new Container()
	PixiViewport.addChild(WorldSprites)
	PixiViewport.addChild(EntitySprites)
}

async function loadGameAssets(): Promise<void> {
	return new Promise((res, rej) => {
		const loader = Loader.shared
		loader.reset()
		PIXI.utils.clearTextureCache()
		loader.add('sprites', './sprites.json')
		loader.onComplete.once(() => res())
		loader.onError.once(() => rej())
		loader.load()
	})
}

export const promisedFrame = async (): Promise<DOMHighResTimeStamp> =>
	new Promise((res) => requestAnimationFrame((time) => res(time)))
