import type { Linter } from "eslint"
import { configs as jsoncConfigs } from "eslint-plugin-jsonc"
import * as jsoncParser from "jsonc-eslint-parser"
import type { ResolvedOptions } from "../options.js"

const deltas = {
	"@stylistic/eol-last": [ "warn",
		"always"
	],
	"@stylistic/comma-spacing": [ "warn",
		{
			before: false,
			after: true
		}
	],
	"@stylistic/no-multi-spaces": "warn",
	"jsonc/array-bracket-spacing": [ "warn",
		"never"
	],
	"jsonc/comma-dangle": [ "warn",
		"never"
	],
	"jsonc/comma-style": [ "warn",
		"last"
	],
	"jsonc/indent": [ "warn",
		"tab"
	],
	"jsonc/key-spacing": [ "warn",
		{
			afterColon: true,
			beforeColon: false
		}
	],
	"jsonc/no-comments": "off",
	"jsonc/no-irregular-whitespace": "off",
	"jsonc/no-octal-escape": "warn",
	"jsonc/object-curly-newline": [ "warn",
		{
			consistent: true,
			multiline: true
		}
	],
	"jsonc/object-curly-spacing": [ "warn",
		"always"
	],
	"jsonc/object-property-newline": [ "warn",
		{
			allowAllPropertiesOnSameLine: true,
			allowMultiplePropertiesPerLine: false
		}
	],
	"jsonc/sort-array-values": [ "warn",
		{
			order: {
				type: "asc"
			},
			pathPattern: "^files$"
		}
	]
} as unknown as Linter.RulesRecord

export function json(opts: ResolvedOptions): Linter.Config[] {
	const recommended = jsoncConfigs["flat/recommended-with-json"] as unknown as Linter.Config[]
	return recommended.map(c => ({
		...c,
		name: "alan/json",
		files: opts.globs.json,
		languageOptions: {
			...c.languageOptions,
			parser: jsoncParser as Linter.Parser
		},
		rules: {
			...c.rules,
			...deltas
		}
	}))
}
