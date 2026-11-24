import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function unusedImports(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/unused-imports",
			files: opts.globs.tsJsVue,
			rules: {
				"@typescript-eslint/no-unused-vars": "off",
				"unused-imports/no-unused-imports": "error",
				"unused-imports/no-unused-vars": [ "error",
					{
						vars: "all",
						varsIgnorePattern: "^_",
						args: "after-used",
						argsIgnorePattern: "^_"
					}
				]
			}
		}
	]
}
