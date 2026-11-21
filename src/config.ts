import type { Linter } from "eslint"
import type { FlatConfigComposer } from "eslint-flat-config-utils"
import { composer } from "eslint-flat-config-utils"
import oxlint from "eslint-plugin-oxlint"
import { antfu } from "./configs/antfu.js"
import { base } from "./configs/base.js"
import { command } from "./configs/command.js"
import { core } from "./configs/core.js"
import { e18e } from "./configs/e18e.js"
import { eslintComments } from "./configs/eslintComments.js"
import { ignores } from "./configs/ignores.js"
import { imports } from "./configs/imports.js"
import { jsdoc } from "./configs/jsdoc.js"
import { json } from "./configs/json.js"
import { node } from "./configs/node.js"
import { nuxt } from "./configs/nuxt.js"
import { pnpm } from "./configs/pnpm.js"
import { regexp } from "./configs/regexp.js"
import { shapes } from "./configs/shapes.js"
import { stylistic } from "./configs/stylistic.js"
import { typescript } from "./configs/typescript.js"
import { unicorn } from "./configs/unicorn.js"
import { unusedImports } from "./configs/unusedImports.js"
import { vue } from "./configs/vue.js"
import { yaml } from "./configs/yaml.js"
import { allowDefaultProjectGlobs, defaultGlobs, resolveOptions } from "./options.js"
import type { ConfigOptions, GlobsConfig, ResolvedGlobs } from "./options.js"
import { plugins } from "./plugins.js"

export type { ConfigOptions, GlobsConfig, ResolvedGlobs }
export { allowDefaultProjectGlobs, defaultGlobs }

export async function createConfig(
	options: ConfigOptions = {},
	extendCb?: (pipeline: FlatConfigComposer) => void
): Promise<FlatConfigComposer> {
	const opts = resolveOptions(options)
	const blocks = [
		{ name: "alan/plugins", plugins: plugins as Linter.Config["plugins"] },
		...ignores(opts),
		...base(opts),
		...core(opts),
		...typescript(opts),
		...stylistic(opts),
		...(opts.vue ? vue(opts) : []),
		...jsdoc(opts),
		...imports(opts),
		...regexp(opts),
		...unicorn(opts),
		...eslintComments(opts),
		...unusedImports(opts),
		...e18e(opts),
		...antfu(opts),
		...node(opts),
		...command(opts),
		...pnpm(opts),
		...shapes(opts),
		...(opts.isNuxtProject ? (await nuxt(opts)) as Linter.Config[] : []),
		...json(opts),
		...yaml(opts),
		...(opts.useOxlint ? await oxlint.buildFromConfigFile(opts.oxlintConfigPath) : [])
	] as unknown as Linter.Config[]
	const pipeline = composer(...blocks)
	if (extendCb) extendCb(pipeline)
	return pipeline
}
