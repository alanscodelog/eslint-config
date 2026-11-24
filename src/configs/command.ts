import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function command(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/command",
			files: opts.globs.tsJsVue,
			rules: {
				"command/command": "error"
			}
		}
	]
}
