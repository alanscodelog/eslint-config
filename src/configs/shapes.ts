import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function shapes(opts: ResolvedOptions): Linter.Config[] {
	const out: Linter.Config[] = []
	out.push(
		{
			name: "alan/stories",
			files: opts.globs.stories,
			rules: {
				"@typescript-eslint/explicit-function-return-type": "off"
			}
		},
		{
			name: "alan/config-files",
			files: [
				"**/nuxt.config.ts"
			],
			rules: {
				"no-console": "warn"
			}
		},
		{
			name: "alan/tests",
			files: opts.globs.test,
			rules: {
				"no-console": "warn",
				"@typescript-eslint/explicit-function-return-type": "off",
				"@typescript-eslint/no-unused-expressions": "error",
				"unused-imports/no-unused-vars": "off"
			}
		}
	)
	return out
}
