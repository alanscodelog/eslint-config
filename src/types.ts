import type { Defu } from "defu"
import type { defaultGlobs, resolveOptions } from "./options.js"

export interface GlobsConfig {
	ts?: string[]
	js?: string[]
	vue?: string[]
	json?: string[]
	yaml?: string[]
	stories?: string[]
	test?: string[]
}

export type ResolvedBaseGlobs = Defu<GlobsConfig, [typeof defaultGlobs]>

export type ResolvedGlobs = ResolvedBaseGlobs & {
	tsJsVue: string[]
	tsVue: string[]
}

export type NuxtDirs = Partial<Record<
	"pages" | "layouts" | "components",
	string[]
>>

export type GeneratedModule = {
	default?: () => unknown
	configs?: unknown
	options?: { dirs?: NuxtDirs }
}

export interface ConfigOptions {
	type?: "lib" | "app"
	isNuxt?: boolean
	isNuxtModule?: boolean
	useOxlint?: boolean | string
	vue?: boolean
	allowDefaultProject?: string[]
	nuxtDirs?: NuxtDirs
	globs?: GlobsConfig
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>
