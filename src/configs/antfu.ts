import type { Linter } from "eslint"
import type { ResolvedOptions } from "../types.js"

export function antfu(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/antfu",
			files: opts.globs.tsJsVue,
			rules: {
				"antfu/consistent-chaining": "warn",
				"antfu/import-dedupe": "error",
				"antfu/no-import-dist": "error",
				"antfu/no-import-node-modules-by-path": "error",
				"antfu/top-level-function": "error"
			}
		}
	]
}
