import tsParser from "@typescript-eslint/parser"
import type { Linter } from "eslint"
import { mergeProcessors } from "eslint-merge-processors"
import vuePlugin from "eslint-plugin-vue"
import processorVueBlocks from "eslint-processor-vue-blocks"
import * as vueParser from "vue-eslint-parser"
import type { ResolvedOptions } from "../options.js"

const vueGlobals = {
	computed: "readonly",
	defineEmits: "readonly",
	defineExpose: "readonly",
	defineProps: "readonly",
	onMounted: "readonly",
	onUnmounted: "readonly",
	reactive: "readonly",
	ref: "readonly",
	shallowReactive: "readonly",
	shallowRef: "readonly",
	toRef: "readonly",
	toRefs: "readonly",
	watch: "readonly",
	watchEffect: "readonly"
} as const

const deltas = {
	"vue/array-bracket-spacing": [ "warn",
		"never"
	],
	"vue/arrow-spacing": [ "warn",
		{
			before: true,
			after: true
		}
	],
	"vue/attribute-hyphenation": [ "warn",
		"always"
	],
	"vue/attributes-order": [ "warn",
		{
			order: [
				"DEFINITION",
				"LIST_RENDERING",
				"CONDITIONALS",
				"RENDER_MODIFIERS",
				"GLOBAL",
				[
					"UNIQUE",
					"SLOT"
				],
				"TWO_WAY_BINDING",
				"OTHER_DIRECTIVES",
				[
					"ATTR_STATIC",
					"ATTR_SHORTHAND_BOOL"
				],
				"ATTR_DYNAMIC",
				"EVENTS",
				"CONTENT"
			]
		}
	],
	"vue/block-order": [ "warn",
		{
			order: [
				[
					"docs"
				],
				"template",
				"script",
				"style"
			]
		}
	],
	"vue/block-spacing": [ "warn",
		"always"
	],
	"vue/block-tag-newline": [ "warn",
		{
			maxEmptyLines: 0
		}
	],
	"vue/brace-style": [ "warn",
		"stroustrup",
		{
			allowSingleLine: true
		}
	],
	"vue/comma-dangle": [ "warn",
		"never"
	],
	"vue/comma-spacing": [ "warn",
		{
			before: false,
			after: true
		}
	],
	"vue/comma-style": [ "warn",
		"last"
	],
	"vue/comment-directive": "error",
	"vue/component-definition-name-casing": [ "warn",
		"kebab-case"
	],
	"vue/component-name-in-template-casing": [ "error",
		"PascalCase",
		{
			ignores: ["/^i-/"]
		}
	],
	"vue/component-options-name-casing": [ "error",
		"PascalCase"
	],
	"vue/custom-event-name-casing": [ "error",
		"kebab-case"
	],
	"vue/define-macros-order": [ "warn",
		{
			order: [
				"defineOptions",
				"defineEmits",
				"defineProps",
				"defineSlots"
			]
		}
	],
	"vue/dot-location": [ "warn",
		"property"
	],
	"vue/dot-notation": [ "warn",
		{
			allowKeywords: true,
			allowPattern: ""
		}
	],
	"vue/eqeqeq": [ "error",
		"smart"
	],
	"vue/first-attribute-linebreak": "warn",
	"vue/html-closing-bracket-newline": [ "warn",
		{
			singleline: "never",
			multiline: "always"
		}
	],
	"vue/html-closing-bracket-spacing": "warn",
	"vue/html-comment-content-spacing": [ "warn",
		"always",
		{
			exceptions: [
				"-"
			]
		}
	],
	"vue/html-end-tags": "warn",
	"vue/html-indent": [ "warn",
		"tab",
		{
			attribute: 1,
			baseIndent: 0,
			closeBracket: 0,
			alignAttributesVertically: false
		}
	],
	"vue/html-quotes": [ "warn",
		"double"
	],
	"vue/html-self-closing": "warn",
	"vue/jsx-uses-vars": "error",
	"vue/key-spacing": [ "warn",
		{
			afterColon: true,
			beforeColon: false
		}
	],
	"vue/keyword-spacing": [ "warn",
		{
			before: true,
			after: true,
			overrides: {}
		}
	],
	"vue/max-attributes-per-line": "off",
	"vue/multi-word-component-names": "off",
	"vue/multiline-html-element-content-newline": "warn",
	"vue/mustache-interpolation-spacing": "warn",
	"vue/no-arrow-functions-in-watch": "error",
	"vue/no-async-in-computed-properties": "error",
	"vue/no-child-content": "error",
	"vue/no-computed-properties-in-data": "error",
	"vue/no-deprecated-data-object-declaration": "error",
	"vue/no-deprecated-delete-set": "error",
	"vue/no-deprecated-destroyed-lifecycle": "error",
	"vue/no-deprecated-dollar-listeners-api": "error",
	"vue/no-deprecated-dollar-scopedslots-api": "error",
	"vue/no-deprecated-events-api": "error",
	"vue/no-deprecated-filter": "error",
	"vue/no-deprecated-functional-template": "error",
	"vue/no-deprecated-html-element-is": "error",
	"vue/no-deprecated-inline-template": "error",
	"vue/no-deprecated-model-definition": "error",
	"vue/no-deprecated-props-default-this": "error",
	"vue/no-deprecated-router-link-tag-prop": "error",
	"vue/no-deprecated-scope-attribute": "warn",
	"vue/no-deprecated-slot-attribute": "warn",
	"vue/no-deprecated-slot-scope-attribute": "warn",
	"vue/no-deprecated-v-bind-sync": "error",
	"vue/no-deprecated-v-is": "warn",
	"vue/no-deprecated-v-on-native-modifier": "error",
	"vue/no-deprecated-v-on-number-modifiers": "error",
	"vue/no-deprecated-vue-config-keycodes": "error",
	"vue/no-dupe-keys": "error",
	"vue/no-dupe-v-else-if": "error",
	"vue/no-duplicate-attributes": "error",
	"vue/no-empty-pattern": [ "error",
		{
			allowObjectPatternsAsParameters: false
		}
	],
	"vue/no-export-in-script-setup": "error",
	"vue/no-expose-after-await": "error",
	"vue/no-irregular-whitespace": "error",
	"vue/no-lifecycle-after-await": "error",
	"vue/no-lone-template": "error",
	"vue/no-loss-of-precision": "error",
	"vue/no-multi-spaces": "warn",
	"vue/no-multiple-slot-args": "error",
	"vue/no-mutating-props": "error",
	"vue/no-parsing-error": "error",
	"vue/no-ref-as-operand": "error",
	"vue/no-required-prop-with-default": "error",
	"vue/no-reserved-component-names": "error",
	"vue/no-reserved-keys": "error",
	"vue/no-reserved-props": "error",
	"vue/no-restricted-syntax": [ "error",
		"DebuggerStatement",
		"LabeledStatement",
		"WithStatement"
	],
	"vue/no-restricted-v-bind": [ "warn",
		"/^v-/"
	],
	"vue/no-shared-component-data": "error",
	"vue/no-side-effects-in-computed-properties": "error",
	"vue/no-spaces-around-equal-signs-in-attribute": "warn",
	"vue/no-sparse-arrays": "error",
	"vue/no-template-key": "error",
	"vue/no-template-shadow": "error",
	"vue/no-textarea-mustache": "error",
	"vue/no-unused-components": "warn",
	"vue/no-unused-refs": "warn",
	"vue/no-unused-vars": "warn",
	"vue/no-use-computed-property-like-method": "error",
	"vue/no-use-v-if-with-v-for": "error",
	"vue/no-useless-template-attributes": "error",
	"vue/no-v-for-template-key-on-child": "error",
	"vue/no-v-html": "error",
	"vue/no-v-text-v-html-on-component": "error",
	"vue/no-watch-after-await": "error",
	"vue/object-curly-spacing": [ "warn",
		"always"
	],
	"vue/object-property-newline": [ "warn",
		{
			allowAllPropertiesOnSameLine: true
		}
	],
	"vue/object-shorthand": [ "warn",
		"always",
		{
			avoidQuotes: true,
			ignoreConstructors: false
		}
	],
	"vue/one-component-per-file": "warn",
	"vue/operator-linebreak": [ "warn",
		"before"
	],
	"vue/order-in-components": "warn",
	"vue/padding-line-between-blocks": [ "warn",
		"always"
	],
	"vue/prefer-import-from-vue": "warn",
	"vue/prefer-template": "warn",
	"vue/prop-name-casing": [ "error",
		"camelCase"
	],
	"vue/quote-props": [ "warn",
		"consistent-as-needed"
	],
	"vue/require-component-is": "error",
	"vue/require-default-prop": "error",
	"vue/require-explicit-emits": "warn",
	"vue/require-prop-type-constructor": "error",
	"vue/require-prop-types": "error",
	"vue/require-render-return": "error",
	"vue/require-slots-as-functions": "error",
	"vue/require-toggle-inside-transition": "error",
	"vue/require-v-for-key": "error",
	"vue/require-valid-default-prop": "error",
	"vue/return-in-computed-property": "error",
	"vue/return-in-emits-validator": "error",
	"vue/singleline-html-element-content-newline": "warn",
	"vue/space-in-parens": [ "warn",
		"never"
	],
	"vue/space-infix-ops": "warn",
	"vue/space-unary-ops": [ "warn",
		{
			words: true,
			nonwords: false
		}
	],
	"vue/template-curly-spacing": [ "warn",
		"never"
	],
	"vue/this-in-template": [ "warn",
		"never"
	],
	"vue/use-v-on-exact": "warn",
	"vue/v-bind-style": [ "warn",
		"shorthand"
	],
	"vue/v-on-event-hyphenation": [ "warn",
		"always",
		{
			autofix: true
		}
	],
	"vue/v-on-style": [ "warn",
		"shorthand"
	],
	"vue/v-slot-style": "warn",
	"vue/valid-attribute-name": "error",
	"vue/valid-define-emits": "error",
	"vue/valid-define-options": "error",
	"vue/valid-define-props": "error",
	"vue/valid-next-tick": "error",
	"vue/valid-template-root": "error",
	"vue/valid-v-bind": "error",
	"vue/valid-v-cloak": "error",
	"vue/valid-v-else": "error",
	"vue/valid-v-else-if": "error",
	"vue/valid-v-for": "error",
	"vue/valid-v-html": "error",
	"vue/valid-v-if": "error",
	"vue/valid-v-is": "error",
	"vue/valid-v-memo": "error",
	"vue/valid-v-model": "error",
	"vue/valid-v-on": "error",
	"vue/valid-v-once": "error",
	"vue/valid-v-pre": "error",
	"vue/valid-v-show": "error",
	"vue/valid-v-slot": "error",
	"vue/valid-v-text": "error"
} as unknown as Linter.RulesRecord

export function vue(opts: ResolvedOptions): Linter.Config[] {
	const recommended = vuePlugin.configs["flat/recommended"] as unknown as Linter.Config[]
	const base = (vuePlugin.configs["flat/base"] as unknown as Linter.Config[])[0]
	return [
		...recommended.map(c => ({
			...c,
			files: opts.globs.vue
		})),
		{
			...base,
			name: "alan/vue-setup",
			files: opts.globs.vue,
			processor: mergeProcessors([
				vuePlugin.processors[".vue"],
				processorVueBlocks({
					blocks: {
						styles: true
					}
				})
			]) as never,
			languageOptions: {
				...base?.languageOptions,
				parser: vueParser as unknown as Linter.Parser,
				parserOptions: {
					parser: tsParser,
					sourceType: "module",
					extraFileExtensions: [".vue"],
					tsconfigRootDir: opts.rootPath,
					projectService: {
						defaultProject: "tsconfig.json",
						allowDefaultProject: opts.allowDefaultProject
					}
				}
			}
		},
		{
			name: "alan/vue-shared",
			files: opts.globs.tsJsVue,
			rules: {
				"vue/comma-dangle": [ "warn",
					"never"
				]
			} as unknown as Linter.RulesRecord
		},
		{
			name: "alan/vue-globals",
			languageOptions: {
				globals: vueGlobals
			}
		},
		{
			name: "alan/vue",
			files: opts.globs.vue,
			rules: deltas
		}
	]
}
