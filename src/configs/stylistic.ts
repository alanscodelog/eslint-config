import type { Linter } from "eslint"
import type { ResolvedOptions } from "../options.js"

export function stylistic(opts: ResolvedOptions): Linter.Config[] {
	return [
		{
			name: "alan/stylistic",
			files: opts.globs.tsJsVue,
			rules: {
				"@stylistic/array-bracket-spacing": [ "warn",
					"never"
				],
				"@stylistic/arrow-parens": [ "warn",
					"as-needed",
					{
						requireForBlockBody: false
					}
				],
				"@stylistic/arrow-spacing": [ "warn",
					{
						before: true,
						after: true
					}
				],
				"@stylistic/block-spacing": [ "warn",
					"always"
				],
				"@stylistic/brace-style": [ "warn",
					"1tbs",
					{
						allowSingleLine: true
					}
				],
				"@stylistic/comma-dangle": [ "warn",
					"never"
				],
				"@stylistic/comma-spacing": [ "warn",
					{
						before: false,
						after: true
					}
				],
				"@stylistic/comma-style": [ "warn",
					"last"
				],
				"@stylistic/computed-property-spacing": [ "warn",
					"never",
					{
						enforceForClassMembers: true
					}
				],
				"@stylistic/dot-location": [ "warn",
					"property"
				],
				"@stylistic/eol-last": [ "warn",
					"always"
				],
				"@stylistic/function-paren-newline": [ "warn",
					"consistent"
				],
				"@stylistic/generator-star-spacing": [ "warn",
					{
						before: false,
						after: true
					}
				],
				"@stylistic/indent": [ "warn",
					"tab",
					{
						SwitchCase: 1,
						flatTernaryExpressions: false,
						ignoredNodes: [
							"TSUnionType",
							"TSIntersectionType"
						],
						offsetTernaryExpressions: true,
						ArrayExpression: 1,
						ObjectExpression: 1,
						ImportDeclaration: 1,
						MemberExpression: 1,
						VariableDeclarator: 1,
						CallExpression: {
							arguments: 1
						},
						FunctionDeclaration: {
							body: 1,
							parameters: 1,
							returnType: 1
						},
						FunctionExpression: {
							body: 1,
							parameters: 1,
							returnType: 1
						},
						outerIIFEBody: 1
					}
				],
				"@stylistic/jsx-closing-bracket-location": [ "warn",
					"tag-aligned"
				],
				"@stylistic/jsx-closing-tag-location": [ "warn",
					"tag-aligned"
				],
				"@stylistic/jsx-curly-brace-presence": [ "warn",
					{
						props: "never",
						children: "never",
						propElementValues: "always"
					}
				],
				"@stylistic/jsx-curly-newline": [ "warn",
					"consistent"
				],
				"@stylistic/jsx-curly-spacing": [ "warn",
					"never"
				],
				"@stylistic/jsx-equals-spacing": [ "warn",
					"never"
				],
				"@stylistic/jsx-first-prop-new-line": [ "warn",
					"multiline-multiprop"
				],
				"@stylistic/jsx-function-call-newline": [ "warn",
					"multiline"
				],
				"@stylistic/jsx-indent-props": [ "warn",
					"tab"
				],
				"@stylistic/jsx-max-props-per-line": [ "warn",
					{
						maximum: 1,
						when: "multiline"
					}
				],
				"@stylistic/jsx-one-expression-per-line": [ "warn",
					{
						allow: "single-child"
					}
				],
				"@stylistic/jsx-quotes": [ "warn",
					"prefer-double"
				],
				"@stylistic/jsx-tag-spacing": [ "warn",
					{
						closingSlash: "never",
						beforeSelfClosing: "always",
						afterOpening: "never",
						beforeClosing: "never"
					}
				],
				"@stylistic/jsx-wrap-multilines": [ "warn",
					{
						declaration: "parens-new-line",
						assignment: "parens-new-line",
						return: "parens-new-line",
						arrow: "parens-new-line",
						condition: "parens-new-line",
						logical: "parens-new-line",
						prop: "parens-new-line",
						propertyValue: "parens-new-line"
					}
				],
				"@stylistic/key-spacing": [ "warn",
					{
						afterColon: true,
						beforeColon: false
					}
				],
				"@stylistic/keyword-spacing": [ "warn",
					{
						before: true,
						after: true,
						overrides: {}
					}
				],
				"@stylistic/lines-between-class-members": [ "warn",
					"always",
					{
						exceptAfterOverload: true,
						exceptAfterSingleLine: true
					}
				],
				"@stylistic/member-delimiter-style": [ "warn",
					{
						multiline: {
							delimiter: "none",
							requireLast: false
						},
						singleline: {
							delimiter: "comma",
							requireLast: false
						},
						multilineDetection: "brackets",
						overrides: {
							interface: {
								multiline: {
									delimiter: "none",
									requireLast: false
								}
							}
						}
					}
				],
				"@stylistic/new-parens": [ "warn",
					"always"
				],
				"@stylistic/no-extra-parens": [ "warn",
					"functions"
				],
				"@stylistic/no-floating-decimal": "warn",
				"@stylistic/no-mixed-operators": [ "warn",
					{
						groups: [
							[
								"==",
								"!=",
								"===",
								"!==",
								">",
								">=",
								"<",
								"<="
							],
							[
								"&&",
								"||"
							],
							[
								"in",
								"instanceof"
							]
						],
						allowSamePrecedence: true
					}
				],
				"@stylistic/no-mixed-spaces-and-tabs": [ "warn",
					false
				],
				"@stylistic/no-multi-spaces": [ "warn",
					{
						exceptions: {
							Property: true,
							ImportAttribute: true
						},
						ignoreEOLComments: false,
						includeTabs: true
					}
				],
				"@stylistic/no-multiple-empty-lines": [ "warn",
					{
						max: 2
					}
				],
				"@stylistic/no-trailing-spaces": [ "warn",
					{
						skipBlankLines: true,
						ignoreComments: false
					}
				],
				"@stylistic/no-whitespace-before-property": "warn",
				"@stylistic/object-curly-spacing": [ "warn",
					"always"
				],
				"@stylistic/padded-blocks": [ "warn",
					{
						blocks: "never",
						classes: "never",
						switches: "never"
					},
					{
						allowSingleLineBlocks: false
					}
				],
				"@stylistic/quote-props": [ "warn",
					"as-needed",
					{
						unnecessary: true
					}
				],
				"@stylistic/quotes": [ "warn",
					"double",
					{
						allowTemplateLiterals: "always",
						avoidEscape: false,
						ignoreStringLiterals: false
					}
				],
				"@stylistic/rest-spread-spacing": [ "warn",
					"never"
				],
				"@stylistic/semi": [ "warn",
					"never"
				],
				"@stylistic/semi-spacing": [ "warn",
					{
						before: false,
						after: true
					}
				],
				"@stylistic/space-before-blocks": [ "warn",
					"always"
				],
				"@stylistic/space-before-function-paren": [ "warn",
					{
						anonymous: "always",
						asyncArrow: "always",
						named: "never"
					}
				],
				"@stylistic/space-in-parens": [ "warn",
					"never"
				],
				"@stylistic/space-infix-ops": [ "warn",
					{
						int32Hint: false,
						ignoreTypes: false
					}
				],
				"@stylistic/space-unary-ops": [ "warn",
					{
						words: true,
						nonwords: false
					}
				],
				"@stylistic/spaced-comment": [ "warn",
					"always",
					{
						block: {
							balanced: true,
							exceptions: [
								"*"
							],
							markers: [
								"!"
							]
						},
						line: {
							exceptions: [
								"/",
								"#"
							],
							markers: [
								"/"
							]
						}
					}
				],
				"@stylistic/template-curly-spacing": [ "warn",
					"never"
				],
				"@stylistic/template-tag-spacing": [ "warn",
					"never"
				],
				"@stylistic/type-annotation-spacing": [ "warn",
					{}
				],
				"@stylistic/type-generic-spacing": "warn",
				"@stylistic/type-named-tuple-spacing": "warn",
				"@stylistic/wrap-iife": [ "warn",
					"inside",
					{
						functionPrototypeMethods: true
					}
				],
				"@stylistic/yield-star-spacing": [ "warn",
					{
						after: true,
						before: false
					}
				]
			} as unknown as Linter.RulesRecord
		}
	]
}
