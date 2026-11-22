import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

const sortImportsOptions = {
	groups: [
		"side-effect",
		"packages",
		"sibling",
		"aliases",
		"relative",
		"unknown"
	],
	customGroups: [
		{
			groupName: "packages",
			elementNamePattern: "^@?\\w"
		},
		{
			groupName: "sibling",
			elementNamePattern: "^\\."
		},
		{
			groupName: "aliases",
			elementNamePattern: "^[^.]"
		},
		{
			groupName: "relative",
			elementNamePattern: "^\\../"
		}
	],
	newlinesBetween: "ignore",
	newlinesInside: "ignore",
	order: "asc",
	type: "natural"
}

const nuxtSortImportsOptions = {
	...sortImportsOptions,
	groups: [
		"side-effect",
		"packages",
		"external",
		"sibling",
		"aliases",
		"relative",
		"unknown"
	],
	customGroups: [
		{
			groupName: "external",
			elementNamePattern: ["^#imports$", "^#app$"]
		},
		...sortImportsOptions.customGroups
	]
}

const tableRules = {
	"import-x/default": "error",
	"import-x/export": "error",
	"import-x/namespace": "error",
	"import-x/no-duplicates": [ "error",
		{
			considerQueryString: true
		}
	],
	"import-x/no-named-as-default": "error",
	"import-x/no-unresolved": [ "error",
		{
			ignore: ["^~icons/"]
		}
	],
	"import-x/consistent-type-specifier-style": [ "warn",
		"prefer-top-level"
	],
	"import-x/first": "warn",
	"import-x/newline-after-import": [ "warn",
		{
			count: 1
		}
	],
	"import-x/no-mutable-exports": "error",
	"import-x/no-named-default": "warn",
	"perfectionist/sort-exports": [ "warn",
		{
			order: "asc",
			type: "natural"
		}
	],
	"perfectionist/sort-imports": [ "warn",
		sortImportsOptions
	],
	"perfectionist/sort-named-exports": [ "warn",
		{
			order: "asc",
			type: "natural"
		}
	],
	"perfectionist/sort-named-imports": [ "warn",
		{
			order: "asc",
			type: "natural"
		}
	]
} as unknown as Linter.RulesRecord

const nuxtTableRules = {
	...tableRules,
	"perfectionist/sort-imports": [ "warn",
		nuxtSortImportsOptions
	]
} as unknown as Linter.RulesRecord

const extraRules = {
	"import-x/no-absolute-path": "error",
	"import-x/no-cycle": "error",
	"import-x/no-extraneous-dependencies": [ "error",
		{
			devDependencies: [
				"!src/**/*"
			],
			optionalDependencies: true,
			peerDependencies: true
		}
	],
	"import-x/no-useless-path-segments": [ "warn",
		{
			noUselessIndex: false
		}
	]
} as unknown as Linter.RulesRecord

export function imports(opts: ResolvedOptions): Linter.Config[] {
	const shared = {
		name: "alan/imports",
		files: opts.globs.tsJsVue,
		settings: {
			"import-x/extensions": [
				".ts",
				".tsx",
				".cts",
				".mts",
				".js",
				".jsx",
				".cjs",
				".mjs"
			],
			"import-x/external-module-folders": [
				"node_modules",
				"node_modules/@types"
			],
			"import-x/parsers": {
				"@typescript-eslint/parser": [
					".ts",
					".tsx",
					".cts",
					".mts"
				]
			},
			"import-x/resolver": {
				typescript: {
					conditionNames: ["import", "require", "node", "default"],
					project: [
						"tsconfig.json",
						...(opts.isNuxtModule ? ["playground/.nuxt/tsconfig.*.json"] : [])
					],
					noWarnOnMultipleProjects: true
				}
			}
		},
		rules: opts.isNuxtProject ? nuxtTableRules : tableRules
	}
	if (opts.isNuxtProject) return [shared]
	return [
		shared,
		{
			name: "alan/imports-config",
			files: opts.globs.ts,
			rules: extraRules
		}
	]
}
