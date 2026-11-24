import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"
import type { Linter } from "eslint"
import type { ResolvedOptions } from "../types.js"

const allowAnyUnderscores = {
	leadingUnderscore: "allowSingleOrDouble",
	trailingUnderscore: "allowSingleOrDouble"
}

const allowSingleUnderscores = {
	leadingUnderscore: "allow",
	trailingUnderscore: "allow"
}

const forbidUnderscores = {
	leadingUnderscore: "forbid",
	trailingUnderscore: "forbid"
}

const requireLeadingUnderscore = {
	leadingUnderscore: "require",
	trailingUnderscore: "allow"
}

const fixExceptions = {
	filter: {
		regex: "^(_+?|_constructor|_mixin)$",
		match: false
	}
}

const namingConvention: Linter.RuleEntry = [ "warn",
	{
		selector: [
			"default"
		],
		format: null,
		...allowAnyUnderscores,
		filter: {
			...fixExceptions.filter,
			match: true
		}
	},
	{
		selector: [
			"default"
		],
		format: [
			"strictCamelCase"
		],
		...allowSingleUnderscores,
		...fixExceptions
	},
	{
		selector: "import",
		format: [
			"strictCamelCase",
			"PascalCase"
		],
		...allowAnyUnderscores
	},
	{
		selector: "default",
		modifiers: [
			"unused"
		],
		format: [
			"strictCamelCase",
			"UPPER_CASE"
		],
		...requireLeadingUnderscore,
		...fixExceptions
	},
	{
		selector: [
			"enumMember",
			"typeProperty"
		],
		format: [
			"strictCamelCase",
			"UPPER_CASE"
		],
		...allowSingleUnderscores,
		...fixExceptions
	},
	{
		selector: [
			"objectLiteralProperty",
			"property"
		],
		format: null,
		...allowAnyUnderscores,
		...fixExceptions
	},
	{
		selector: "variable",
		format: [
			"strictCamelCase",
			"UPPER_CASE"
		],
		...allowSingleUnderscores,
		...fixExceptions
	},
	{
		selector: "memberLike",
		modifiers: [
			"private"
		],
		format: [
			"camelCase"
		],
		...requireLeadingUnderscore,
		...fixExceptions
	},
	{
		selector: "memberLike",
		modifiers: [
			"public"
		],
		format: [
			"camelCase"
		],
		...forbidUnderscores,
		...fixExceptions
	},
	{
		selector: "typeLike",
		format: [
			"StrictPascalCase"
		],
		...forbidUnderscores
	},
	{
		selector: "typeParameter",
		format: [
			"StrictPascalCase"
		],
		prefix: [
			"T"
		],
		...forbidUnderscores
	},
	{
		selector: "enum",
		format: null,
		custom: {
			match: true,
			regex: "^(?<UPPER_Maybe_PascalCase>(?!_[a-z])_*[A-Za-z]+(?!_[a-z])_*)+$"
		},
		...allowSingleUnderscores
	},
	{
		selector: [
			"default"
		],
		format: null,
		leadingUnderscore: "allow",
		trailingUnderscore: "allow",
		custom: {
			regex: "^HTML",
			match: true
		}
	}
]

const explicitFunctionReturnType: Linter.RuleEntry = [ "warn",
	{
		allowConciseArrowFunctionExpressionsStartingWithVoid: true,
		allowDirectConstAssertionInArrowFunctions: true,
		allowExpressions: true,
		allowHigherOrderFunctions: true,
		allowTypedFunctionExpressions: true
	}
]

const typeAwareRules = {
	"@typescript-eslint/naming-convention": namingConvention,
	"@typescript-eslint/await-thenable": "error",
	"@typescript-eslint/dot-notation": "warn",
	"@typescript-eslint/no-base-to-string": "error",
	"@typescript-eslint/no-floating-promises": [ "error",
		{
			ignoreIIFE: true
		}
	],
	"@typescript-eslint/no-for-in-array": "error",
	"@typescript-eslint/no-implied-eval": "error",
	"@typescript-eslint/no-misused-promises": [ "error",
		{
			checksVoidReturn: {
				arguments: false
			}
		}
	],
	"@typescript-eslint/no-unnecessary-boolean-literal-compare": "warn",
	"@typescript-eslint/no-unnecessary-qualifier": "warn",
	"@typescript-eslint/non-nullable-type-assertion-style": "warn",
	"@typescript-eslint/only-throw-error": "error",
	"@typescript-eslint/prefer-includes": "warn",
	"@typescript-eslint/prefer-nullish-coalescing": [ "error",
		{
			ignoreConditionalTests: true,
			ignoreMixedLogicalExpressions: true
		}
	],
	"@typescript-eslint/prefer-optional-chain": "warn",
	"@typescript-eslint/prefer-readonly": "warn",
	"@typescript-eslint/prefer-reduce-type-parameter": "error",
	"@typescript-eslint/prefer-string-starts-ends-with": "warn",
	"@typescript-eslint/restrict-plus-operands": "error",
	"@typescript-eslint/restrict-template-expressions": [ "error",
		{
			allowNumber: true,
			allowBoolean: true,
			allowAny: true
		}
	],
	"@typescript-eslint/return-await": "error",
	"@typescript-eslint/switch-exhaustiveness-check": [ "error",
		{
			considerDefaultExhaustiveForUnions: true
		}
	]
} satisfies Linter.RulesRecord

// turn these on one at a time once the codebase handles them
//
// "@typescript-eslint/no-unsafe-argument": "error",
// "@typescript-eslint/no-unsafe-assignment": "error",
// "@typescript-eslint/no-unsafe-call": "error",
// "@typescript-eslint/no-unsafe-member-access": "error",
// "@typescript-eslint/no-unsafe-return": "error",
// "@typescript-eslint/strict-boolean-expressions": "error",
// "@typescript-eslint/no-unnecessary-type-assertion": "error"

const deltas = {
	"@typescript-eslint/ban-ts-comment": [ "error",
		{
			"ts-expect-error": "allow-with-description",
			"ts-nocheck": "allow-with-description",
			minimumDescriptionLength: 1
		}
	],
	"@typescript-eslint/consistent-type-imports": [ "warn",
		{
			prefer: "type-imports",
			fixStyle: "separate-type-imports",
			disallowTypeAnnotations: true
		}
	],
	"@typescript-eslint/no-array-constructor": "error",
	"@typescript-eslint/no-dupe-class-members": "error",
	"@typescript-eslint/no-duplicate-enum-values": "error",
	"@typescript-eslint/no-empty-object-type": "off",
	"@typescript-eslint/no-explicit-any": "off",
	"@typescript-eslint/no-extra-non-null-assertion": "error",
	"@typescript-eslint/no-import-type-side-effects": "error",
	"@typescript-eslint/no-misused-new": "error",
	"@typescript-eslint/no-namespace": "warn",
	"@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
	"@typescript-eslint/no-non-null-asserted-optional-chain": "error",
	"@typescript-eslint/no-redeclare": [ "error",
		{
			ignoreDeclarationMerge: true
		}
	],
	"@typescript-eslint/no-require-imports": "error",
	"@typescript-eslint/no-this-alias": [ "warn",
		{
			allowDestructuring: true,
			allowedNames: [
				"self",
				"context"
			]
		}
	],
	"@typescript-eslint/no-unnecessary-type-constraint": "warn",
	"@typescript-eslint/no-unsafe-declaration-merging": "error",
	"@typescript-eslint/no-unsafe-function-type": "error",
	"@typescript-eslint/no-unused-expressions": [ "error",
		{
			allowShortCircuit: true,
			allowTaggedTemplates: true,
			allowTernary: true
		}
	],
	"@typescript-eslint/no-use-before-define": [ "error",
		{
			classes: false,
			functions: false,
			variables: true
		}
	],
	"@typescript-eslint/no-wrapper-object-types": "error",
	"@typescript-eslint/prefer-as-const": "warn",
	"@typescript-eslint/prefer-literal-enum-member": "warn",
	"@typescript-eslint/prefer-namespace-keyword": "warn",
	"@typescript-eslint/triple-slash-reference": "off"
} satisfies Linter.RulesRecord

export function typescript(opts: ResolvedOptions): Linter.Config[] {
	const recommended = tsPlugin.configs["flat/recommended"] as Linter.Config[]
	const eslintRecommended = tsPlugin.configs["flat/eslint-recommended"] as Linter.Config
	const returnTypes = opts.type === "lib"
		? {
				"@typescript-eslint/explicit-function-return-type": explicitFunctionReturnType
			}
		: {}

	return [
		...recommended.map(c => ({
			...c,
			files: opts.globs.ts
		})),
		{
			...eslintRecommended,
			name: "alan/eslint-recommended",
			files: opts.globs.tsVue
		},
		{
			name: "alan/typescript",
			files: opts.globs.ts,
			languageOptions: {
				parser: tsParser,
				parserOptions: {
					tsconfigRootDir: opts.rootPath,
					projectService: {
						defaultProject: "tsconfig.json",
						allowDefaultProject: opts.allowDefaultProject
					},
					ecmaVersion: "latest",
					sourceType: "module"
				}
			},
			rules: {
				...deltas,
				...returnTypes
			}
		},
		{
			name: "alan/typescript-vue",
			files: opts.globs.vue,
			rules: deltas
		},
		{
			name: "alan/typescript-type-aware",
			files: opts.globs.tsVue,
			rules: typeAwareRules
		}
	]
}
