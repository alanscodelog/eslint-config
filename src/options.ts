import { defuArrayFn } from "defu"
import type { Defu } from "defu"
import fs from "node:fs"
import path from "node:path"

export const allowDefaultProjectGlobs = [
	"*.js",
	"*.ts",
	"*.cjs",
	"*.mjs"
]

const NUXT_CONFIG_EXTENSIONS = [
	"js",
	"ts",
	"jsx",
	"tsx",
	"cjs",
	"cts",
	"cjsx",
	"ctsx",
	"mjs",
	"mts",
	"mjsx",
	"mtsx"
]

export interface GlobsConfig {
	ts?: string[]
	js?: string[]
	vue?: string[]
	json?: string[]
	yaml?: string[]
	stories?: string[]
	test?: string[]
}

export const defaultGlobs = {
	ts: ["**/*.{ts,tsx,cts,mts}"],
	js: ["**/*.{js,cjs,mjs,jsx}"],
	vue: ["**/*.vue"],
	json: ["**/*.{json,json5,jsonc}"],
	yaml: ["**/*.{yaml,yml}"],
	stories: ["**/*.stories.*"],
	test: [
		"**/test/**",
		"**/tests/**",
		"**/*.test.*",
		"**/*.spec.*"
	]
} satisfies GlobsConfig

type ResolvedBaseGlobs = Defu<GlobsConfig, [typeof defaultGlobs]>

export type ResolvedGlobs = ResolvedBaseGlobs & {
	tsJsVue: string[]
	tsVue: string[]
}

export interface ConfigOptions {
	type?: "lib" | "app"
	isNuxt?: boolean
	isNuxtModule?: boolean
	useOxlint?: boolean | string
	vue?: boolean
	allowDefaultProject?: string[]
	nuxtDirs?: {
		pages?: string[]
		layouts?: string[]
		components?: string[]
	}
	globs?: GlobsConfig
}

function isFile(target: string) {
	try {
		return fs.statSync(target).isFile()
	} catch {
		return false
	}
}

export function resolveOptions(options: ConfigOptions = {}) {
	const rootPath = process.cwd()
	const hasNuxtConfig = NUXT_CONFIG_EXTENSIONS.some(ext => fs.existsSync(path.join(rootPath, `nuxt.config.${ext}`)))
	const hasPlaygroundNuxtConfig = NUXT_CONFIG_EXTENSIONS.some(ext => fs.existsSync(path.join(rootPath, "playground", `nuxt.config.${ext}`)))
	const defaultOxlintPath = path.join(rootPath, ".oxlintrc.json")

	const looksLikeModule = !hasNuxtConfig && isFile(path.join(rootPath, "src/module.ts"))
	const resolvedIsNuxt = options.isNuxt ?? hasNuxtConfig

	/*
	 Nuxt generated tsconfigs own root TypeScript config files such as nuxt.config.ts. Nuxt's
	 own config only allows root JS files in allowDefaultProject for this reason.
	*/
	const defaultAllowDefaultProject = resolvedIsNuxt
		? allowDefaultProjectGlobs.filter(glob => glob !== "*.ts")
		: allowDefaultProjectGlobs

	const {
		type = "lib",
		isNuxt = resolvedIsNuxt,
		isNuxtModule = looksLikeModule,
		useOxlint = fs.existsSync(defaultOxlintPath),
		vue = isNuxt || isNuxtModule,
		allowDefaultProject = defaultAllowDefaultProject,
		nuxtDirs
	} = options

	if (options.isNuxt && !hasNuxtConfig) throw new Error("ESLint Config Error: 'isNuxt: true' was passed but no supported 'nuxt.config.*' file was found.")

	const oxlintConfigPath = typeof useOxlint === "string" ? useOxlint : defaultOxlintPath
	if (useOxlint && !fs.existsSync(oxlintConfigPath)) throw new Error(`ESLint Config Error: Oxlint config not found at: ${oxlintConfigPath}`)

	const mergedGlobs: ResolvedBaseGlobs = defuArrayFn(options.globs ?? {}, defaultGlobs)
	const globs: ResolvedGlobs = {
		...mergedGlobs,
		tsJsVue: [...new Set([
			...mergedGlobs.ts,
			...mergedGlobs.js,
			...mergedGlobs.vue
		])],
		tsVue: [...new Set([
			...mergedGlobs.ts,
			...mergedGlobs.vue
		])]
	}

	return { rootPath, type, isNuxt, isNuxtModule, isNuxtProject: isNuxt || isNuxtModule, hasPlaygroundNuxtConfig, useOxlint, vue, allowDefaultProject, nuxtDirs, oxlintConfigPath, globs }
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>
