import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function ignores(_opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/ignores",
			ignores: [
				"**/.direnv/**",
				"**/.devenv/**",
				"**/node_modules/**",
				"**/dist/**",
				"**/.nuxt/**",
				"**/.output/**",
				"**/coverage/**"
			]
		}
	]
}
