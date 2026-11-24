import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function unicorn(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/unicorn",
			files: opts.globs.tsJsVue,
			rules: {
				"unicorn/consistent-empty-array-spread": "warn",
				"unicorn/error-message": "error",
				"unicorn/escape-case": [ "warn",
					"uppercase"
				],
				"unicorn/new-for-builtins": "warn",
				"unicorn/no-instanceof-builtins": [ "error",
					{
						useErrorIsError: false,
						strategy: "loose",
						include: [],
						exclude: []
					}
				],
				"unicorn/no-new-array": "error",
				"unicorn/no-new-buffer": "error",
				"unicorn/number-literal-case": [ "warn",
					{
						hexadecimalValue: "uppercase"
					}
				],
				"unicorn/prefer-dom-node-text-content": "warn",
				"unicorn/prefer-includes": "warn",
				"unicorn/prefer-node-protocol": "warn",
				"unicorn/prefer-number-properties": [ "warn",
					{
						checkInfinity: false,
						checkNaN: true
					}
				],
				"unicorn/prefer-string-starts-ends-with": "warn",
				"unicorn/prefer-type-error": "error",
				"unicorn/throw-new-error": "warn"
			}
		}
	]
}
