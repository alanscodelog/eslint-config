import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function core(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/core",
			files: opts.globs.tsJsVue,
			rules: {
				"accessor-pairs": [ "warn",
					{
						enforceForTSTypes: false,
						enforceForClassMembers: true,
						getWithoutSet: false,
						setWithoutGet: true
					}
				],
				"block-scoped-var": "warn",
				"default-case-last": "warn",
				"dot-notation": [ "warn",
					{
						allowKeywords: true,
						allowPattern: ""
					}
				],
				eqeqeq: [ "error",
					"always"
				],
				"new-cap": [ "error",
					{
						capIsNew: false,
						capIsNewExceptions: [
							"Array",
							"Boolean",
							"Date",
							"Error",
							"Function",
							"Number",
							"Object",
							"RegExp",
							"String",
							"Symbol",
							"BigInt"
						],
						newIsCap: true,
						newIsCapExceptions: [],
						properties: true
					}
				],
				"no-alert": "warn",
				"no-async-promise-executor": "error",
				"no-caller": "error",
				"no-case-declarations": "error",
				"no-compare-neg-zero": "error",
				"no-cond-assign": [ "error",
					"always"
				],
				"no-console": [ "warn",
					{
						allow: [
							"warn",
							"error"
						]
					}
				],
				"no-control-regex": "error",
				"no-debugger": "error",
				"no-delete-var": "error",
				"no-duplicate-case": "error",
				"no-empty": [ "warn",
					{
						allowEmptyCatch: false
					}
				],
				"no-empty-pattern": [ "error",
					{
						allowObjectPatternsAsParameters: false
					}
				],
				"no-eval": [ "error",
					{
						allowIndirect: false
					}
				],
				"no-ex-assign": "error",
				"no-extend-native": [ "error",
					{
						exceptions: []
					}
				],
				"no-extra-bind": "warn",
				"no-extra-boolean-cast": [ "warn",
					{}
				],
				"no-fallthrough": [ "error",
					{
						allowEmptyCase: false,
						reportUnusedFallthroughComment: false
					}
				],
				"no-global-assign": [ "error",
					{
						exceptions: []
					}
				],
				"no-implied-eval": "error",
				"no-irregular-whitespace": [ "error",
					{
						skipComments: false,
						skipJSXText: false,
						skipRegExps: false,
						skipStrings: true,
						skipTemplates: false
					}
				],
				"no-iterator": "error",
				"no-labels": [ "warn",
					{
						allowLoop: true,
						allowSwitch: false
					}
				],
				"no-lone-blocks": "warn",
				"no-loss-of-precision": "error",
				"no-misleading-character-class": [ "error",
					{
						allowEscape: false
					}
				],
				"no-multi-str": "warn",
				"no-new": "warn",
				"no-new-func": "error",
				"no-new-wrappers": "error",
				"no-octal": "warn",
				"no-octal-escape": "warn",
				"no-proto": "error",
				"no-prototype-builtins": "error",
				"no-regex-spaces": "warn",
				"no-restricted-globals": [ "error",
					{
						message: "Use `globalThis` instead.",
						name: "global"
					},
					{
						message: "Use `globalThis` instead.",
						name: "self"
					}
				],
				"no-restricted-properties": [ "error",
					{
						message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
						property: "__proto__"
					},
					{
						message: "Use `Object.defineProperty` instead.",
						property: "__defineGetter__"
					},
					{
						message: "Use `Object.defineProperty` instead.",
						property: "__defineSetter__"
					},
					{
						message: "Use `Object.getOwnPropertyDescriptor` instead.",
						property: "__lookupGetter__"
					},
					{
						message: "Use `Object.getOwnPropertyDescriptor` instead.",
						property: "__lookupSetter__"
					}
				],
				"no-restricted-syntax": [ "error",
					"TSEnumDeclaration[const=true]",
					"TSExportAssignment"
				],
				"no-self-assign": [ "error",
					{
						props: true
					}
				],
				"no-self-compare": "error",
				"no-sequences": [ "warn",
					{
						allowInParentheses: true
					}
				],
				"no-shadow-restricted-names": [ "error",
					{
						reportGlobalThis: true
					}
				],
				"no-sparse-arrays": "error",
				"no-template-curly-in-string": "error",
				"no-throw-literal": "error",
				"no-undef-init": "warn",
				"no-unexpected-multiline": "error",
				"no-unmodified-loop-condition": "error",
				"no-unneeded-ternary": [ "warn",
					{
						defaultAssignment: false
					}
				],
				"no-unreachable-loop": [ "error",
					{
						ignore: []
					}
				],
				"no-unsafe-finally": "error",
				"no-useless-call": "warn",
				"no-useless-catch": "warn",
				"no-useless-computed-key": [ "warn",
					{
						enforceForClassMembers: true
					}
				],
				"no-useless-rename": [ "warn",
					{
						ignoreDestructuring: false,
						ignoreImport: false,
						ignoreExport: false
					}
				],
				"no-useless-return": "warn",
				"no-var": "error",
				"object-shorthand": [ "warn",
					"always",
					{
						avoidQuotes: true,
						ignoreConstructors: false
					}
				],
				"one-var": [ "warn",
					{
						var: "never",
						const: "never"
					}
				],
				"prefer-arrow-callback": [ "warn",
					{
						allowNamedFunctions: false,
						allowUnboundThis: true
					}
				],
				"prefer-const": [ "warn",
					{
						destructuring: "all",
						ignoreReadBeforeAssign: true
					}
				],
				"prefer-exponentiation-operator": "warn",
				"prefer-promise-reject-errors": [ "error",
					{
						allowEmptyReject: false
					}
				],
				"prefer-regex-literals": [ "warn",
					{
						disallowRedundantWrapping: true
					}
				],
				"prefer-rest-params": "warn",
				"prefer-spread": "warn",
				"prefer-template": "warn",
				"symbol-description": "warn",
				"unicode-bom": [ "warn",
					"never"
				],
				"use-isnan": [ "error",
					{
						enforceForIndexOf: true,
						enforceForSwitchCase: true
					}
				],
				"valid-typeof": [ "error",
					{
						requireStringLiterals: true
					}
				],
				"vars-on-top": "warn",
				yoda: [ "warn",
					"never",
					{
						exceptRange: false,
						onlyEquality: false
					}
				]
			} as unknown as Linter.RulesRecord
		}
	]
}
