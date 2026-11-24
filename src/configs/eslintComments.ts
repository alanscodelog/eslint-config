import type { Linter } from "eslint"
import type { ResolvedOptions } from "../types.js"

export function eslintComments(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/eslint-comments",
			files: opts.globs.tsJsVue,
			rules: {
				"eslint-comments/no-aggregating-enable": "warn",
				"eslint-comments/no-duplicate-disable": "error",
				"eslint-comments/no-unused-enable": "error"
			}
		}
	]
}
