import type { Linter } from "eslint"
import type { ResolvedOptions } from "../types.js"

export function node(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/node",
			files: opts.globs.ts,
			rules: {
				"node/handle-callback-err": [ "error",
					"^(err|error)$"
				],
				"node/no-deprecated-api": "error",
				"node/no-exports-assign": "error",
				"node/no-new-require": "warn",
				"node/no-path-concat": "error",
				"node/prefer-global/buffer": [ "warn",
					"never"
				],
				"node/process-exit-as-throw": "error"
			}
		}
	]
}
