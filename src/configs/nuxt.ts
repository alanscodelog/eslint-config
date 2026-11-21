import type { Linter } from "eslint"
import fs from "node:fs"
import path, { posix } from "node:path"
import type { ResolvedOptions } from "../options.js"

/*
 We do not use Nuxt's generated ESLint configs directly because they own
 JS, TS, Vue, import, tooling, stylistic, and formatter rules. Using them would
 duplicate or override this package's rules. We import the generated module only
 to read the project's auto-import globals and resolved directories, then define
 the small Nuxt-specific rule set here.

 Directory globs copied from @nuxt/eslint-config v1.17.0:
 https://github.com/nuxt/eslint/blob/v1.17.0/packages/eslint-config/src/configs/disables.ts#L7-L41
 https://github.com/nuxt/eslint/blob/v1.17.0/packages/eslint-config/src/configs/nuxt.ts#L8-L98
*/
type NuxtDirs = Partial<Record<
	"pages" | "layouts" | "components",
	string[]
>>

const NUXT_EXTS = "{js,ts,jsx,tsx,vue}"
const NESTED_GLOB = `**/*.${NUXT_EXTS}`
const NUXT_DIR_KEYS = ["pages", "layouts", "components"] as const
const RUNTIME_DIR_KEYS = NUXT_DIR_KEYS

type GeneratedModule = {
	default?: () => unknown
	configs?: unknown
	options?: { dirs?: NuxtDirs }
}

async function readGeneratedConfig(file: string, prefix: string) {
	if (!fs.existsSync(file)) {
		throw new Error(`Nuxt ESLint config not found at ${file}. You must run nuxt prepare.`)
	}

	let mod: GeneratedModule
	try {
		mod = (await import(file)) as GeneratedModule
	} catch (error) {
		throw new Error(`Unable to import generated Nuxt ESLint config from ${file}. You must run nuxt prepare.`, { cause: error })
	}

	const built = typeof mod.default === "function" ? mod.default() : mod.configs
	let configs: Linter.Config[] = []

	if (built && typeof (built as { toConfigs?: unknown }).toConfigs === "function") {
		configs = await (built as { toConfigs: () => Promise<Linter.Config[]> }).toConfigs()
	} else if (Array.isArray(built)) {
		configs = built
	}

	let globals: Record<string, "readonly" | "writable" | "off"> = {}
	for (const config of configs) {
		const configGlobals = config.languageOptions?.globals ?? {}
		globals = {
			...globals,
			...configGlobals
		}
	}

	const generatedDirs = mod.options?.dirs ?? {}
	const dirs: NuxtDirs = {}
	for (const key of NUXT_DIR_KEYS) {
		const generatedPaths = generatedDirs[key]
		if (!generatedPaths?.length) continue
		dirs[key] = generatedPaths.map(dir => prefix ? posix.join(prefix, dir || ".") : dir || ".")
	}

	return {
		dirs,
		globals,
		files: prefix ? [`${prefix}/**`] : undefined
	}
}

function collectRuntimeDirs(rootPath: string): NuxtDirs {
	const dirs: NuxtDirs = {}

	for (const key of RUNTIME_DIR_KEYS) {
		const relative = posix.join("src/runtime", key)
		const filesystemPath = path.join(rootPath, ...relative.split("/"))
		if (fs.statSync(filesystemPath, { throwIfNoEntry: false })?.isDirectory()) dirs[key] = [relative]
	}

	return dirs
}

async function readNuxtData(opts: ResolvedOptions) {
	const generatedFile = opts.isNuxt
		? path.join(opts.rootPath, "./.nuxt/eslint.config.mjs")
		: path.join(opts.rootPath, "./playground/.nuxt/eslint.config.mjs")
	const prefix = opts.isNuxt ? "" : "playground"
	const shouldReadGenerated = opts.isNuxt || opts.hasPlaygroundNuxtConfig
	const generated = shouldReadGenerated
		? await readGeneratedConfig(generatedFile, prefix)
		: undefined

	let dirs: NuxtDirs = generated?.dirs ?? {}
	let globals: Record<string, string> = generated?.globals ?? {}
	const scoped = generated?.files
		? [{ files: generated.files, globals: generated.globals }]
		: []

	const includeRuntimeDirs = generated ? !opts.isNuxt : opts.isNuxtProject
	if (includeRuntimeDirs) {
		const runtimeDirs = collectRuntimeDirs(opts.rootPath)
		for (const key of NUXT_DIR_KEYS) {
			const runtimePaths = runtimeDirs[key]
			if (!runtimePaths?.length) continue
			dirs = {
				...dirs,
				[key]: [...(dirs[key] ?? []), ...runtimePaths]
			}
		}
	}

	for (const key of NUXT_DIR_KEYS) {
		const userPaths = opts.nuxtDirs?.[key]
		if (!userPaths?.length) continue
		dirs = {
			...dirs,
			[key]: userPaths.map(dir => prefix ? posix.join(prefix, dir || ".") : dir || ".")
		}
	}

	if (generated?.files) globals = {}

	return { dirs, globals, scoped }
}

function toNestedGlobs(dirs: string[] | undefined) {
	return (dirs ?? []).map(dir => posix.join(dir, NESTED_GLOB))
}

export async function nuxt(opts: ResolvedOptions): Promise<Linter.Config[]> {
	const { dirs, globals, scoped } = await readNuxtData(opts)

	const pageGlobs = toNestedGlobs(dirs.pages).sort()
	const singleRootGlobs = [
		...toNestedGlobs(dirs.layouts),
		...toNestedGlobs(dirs.pages),
		...(dirs.components ?? []).map(dir => posix.join(dir, `**/*.server.${NUXT_EXTS}`))
	].sort()

	const scopedAutoImportBlocks = scoped.map(({ files, globals }) => ({
		name: "alan/nuxt-auto-imports",
		files,
		languageOptions: { globals }
	}))

	const playgroundBlocks = !opts.isNuxt
		? [{
				name: "alan/nuxt-playground",
				files: ["playground/**"],
				rules: { "@typescript-eslint/explicit-function-return-type": "off" } as unknown as Linter.RulesRecord
			}]
		: []

	const singleRootBlocks = singleRootGlobs.length
		? [{
				name: "alan/nuxt-single-root",
				files: singleRootGlobs,
				rules: { "vue/no-multiple-template-root": "error" } as Linter.RulesRecord
			}]
		: []

	const pageBlocks = pageGlobs.length
		? [{
				name: "alan/nuxt-pages",
				files: pageGlobs,
				rules: { "nuxt/no-page-meta-runtime-values": "error" } as Linter.RulesRecord
			}]
		: []

	return [
		{
			name: "alan/nuxt-globals",
			languageOptions: { globals: { ...globals, $fetch: "readonly" } }
		},
		...scopedAutoImportBlocks,
		{
			name: "alan/nuxt-imports-off",
			files: opts.globs.tsVue,
			rules: {
				"import-x/default": "error",
				"import-x/export": "error",
				"import-x/namespace": "error",
				"import-x/no-duplicates": "error",
				"import-x/no-named-as-default": "error",
				"import-x/no-unresolved": [ "error",
					{
						ignore: ["^~icons/"]
					}
				]
			} as Linter.RulesRecord
		},
		{
			name: "alan/nuxt-rules",
			files: opts.globs.tsVue,
			rules: { "nuxt/prefer-import-meta": "error" } as Linter.RulesRecord
		},
		{
			name: "alan/nuxt-config",
			files: [
				"**/.config/nuxt.?([cm])[jt]s?(x)",
				"**/nuxt.config.?([cm])[jt]s?(x)"
			],
			rules: {
				"nuxt/no-nuxt-config-test-key": "error",
				"nuxt/nuxt-config-keys-order": "error",
				"@typescript-eslint/explicit-function-return-type": "off"
			} as Linter.RulesRecord
		},
		...playgroundBlocks,
		...singleRootBlocks,
		...pageBlocks
	]
}
