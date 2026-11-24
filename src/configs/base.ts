import type { Linter } from "eslint"
import globals from "globals"
import type { ResolvedOptions } from "../types.js"

export function base(_opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/base-globals",
			linterOptions: {
				reportUnusedDisableDirectives: true
			},
			languageOptions: {
				ecmaVersion: "latest",
				globals: {
					...globals.browser,
					...globals.node,
					...globals.builtin
				}
			}
		}
	]
}
