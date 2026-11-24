import type { Linter } from "eslint"
import type { ResolvedOptions } from "../types.js"

export function e18e(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/e18e",
			files: opts.globs.tsJsVue,
			rules: {
				"e18e/prefer-array-at": "warn",
				"e18e/prefer-array-from-map": "warn",
				"e18e/prefer-array-some": "error",
				"e18e/prefer-date-now": "warn",
				"e18e/prefer-includes": "warn",
				"e18e/prefer-nullish-coalescing": "error",
				"e18e/prefer-object-has-own": "warn",
				"e18e/prefer-regex-test": "warn",
				"e18e/prefer-url-canparse": "warn"
			}
		}
	]
}
