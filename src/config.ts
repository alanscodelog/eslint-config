import type { NuxtESLintConfigOptions } from "@nuxt/eslint-config"
import type { Linter } from "eslint"
import type { FlatConfigComposer } from "eslint-flat-config-utils"
import fs from "node:fs"
import path from "node:path"
import { antfu } from "@antfu/eslint-config"
import tsParser from "@typescript-eslint/parser"
import { composer } from "eslint-flat-config-utils"

import { importX } from "eslint-plugin-import-x"
import jsdocPlugin from "eslint-plugin-jsdoc"
import oxlint from "eslint-plugin-oxlint"

// Constants for naming-convention logic
const allowAnyUnderscores = { leadingUnderscore: "allowSingleOrDouble", trailingUnderscore: "allowSingleOrDouble" }
const allowSingleUnderscores = { leadingUnderscore: "allow", trailingUnderscore: "allow" }
const forbidUnderscores = { leadingUnderscore: "forbid", trailingUnderscore: "forbid" }
const requireLeadingUnderscore = { leadingUnderscore: "require", trailingUnderscore: "allow" }
const fixExceptions = { filter: { regex: "^(_+?|_constructor|_mixin)$", match: false } }

export interface ConfigOptions {
	type?: "lib" | "app"
	isNuxt?: boolean
	isNuxtModule?: boolean
	useOxlint?: boolean | string
	vue?: boolean
	allowDefaultProject?: string[]
	/** Options passed through to the Nuxt ESLint pipeline (withNuxt for apps, createConfigForNuxt for modules) */
	nuxtEslintOptions?: NuxtESLintConfigOptions
}

export async function createConfig(
	options: ConfigOptions = {},
	// we do it this way because composer returns a promise and otherwise
	// it gets unwrapped and resolved to the full config if we just return it for extention
	extendCb?: (pipeline: FlatConfigComposer) => void,
): Promise<FlatConfigComposer> {
	const rootPath = process.cwd()

	const hasNuxtConfig = fs.existsSync(path.join(rootPath, "nuxt.config.ts")) || fs.existsSync(path.join(rootPath, "nuxt.config.js"))
	const defaultOxlintPath = path.join(rootPath, ".oxlintrc.json")
	const hasOxlintConfig = fs.existsSync(defaultOxlintPath)

	const {
		type = "lib",
		isNuxt = hasNuxtConfig,
		isNuxtModule = false,
		useOxlint = hasOxlintConfig,
		vue = isNuxt || isNuxtModule || false, // default true if Nuxt is enabled
		allowDefaultProject = ["*.js", "*.mjs", "*.cjs"],
		nuxtEslintOptions,
	} = options

	if (options.isNuxt && !hasNuxtConfig) {
		throw new Error("ESLint Config Error: 'isNuxt: true' was passed but no 'nuxt.config.ts' or 'nuxt.config.js' was found.")
	}

	const oxlintConfigPath = typeof useOxlint === "string" ? useOxlint : defaultOxlintPath
	if (useOxlint && !fs.existsSync(oxlintConfigPath)) {
		throw new Error(`ESLint Config Error: Oxlint config not found at: ${oxlintConfigPath}`)
	}

	let pipeline = composer()

	let hasNuxtPipeline = false

	if (isNuxt) {
		try {
			const { default: withNuxt } = await import(path.join(rootPath, "./.nuxt/eslint.config.mjs"))
			pipeline = withNuxt(nuxtEslintOptions)
			hasNuxtPipeline = true
		} catch {
			console.warn("Nuxt ESLint config found but .nuxt/eslint.config.mjs is missing. Run 'nuxi prepare' first.")
		}
	} else if (isNuxtModule) {
		try {
			const { createConfigForNuxt } = await import("@nuxt/eslint-config")
			pipeline = createConfigForNuxt({
				...nuxtEslintOptions,
				features: {
					standalone: false,
					...nuxtEslintOptions?.features,
				},
			})
			hasNuxtPipeline = true
		} catch (e) {
			console.warn("@nuxt/eslint-config not found. Falling back to default composer.", e)
		}
	}

	pipeline.append(
		antfu(
			{
				stylistic: {
					indent: "tab" as const,
					quotes: "double",
					semi: false,
					jsx: true,
					// #awaiting https://github.com/antfu/eslint-config/issues/724
					// they're actually removed at the code level (https://github.com/antfu/eslint-config/blob/fe3d361154ec0cbdea2f1dc35b03332511066fb8/src/configs/formatters.ts#L52)
					...{
						braceStyle: "1tbs",
						arrowParens: false,
						severity: "warn",
					} as any,
				}, // satisfies StylisticCustomizeOptions as any,

				typescript: true,
				vue,
				yaml: true,
				jsonc: true,
				type,
			},

		).renamePlugins({
			// map back antfu's renames
			// while nice, i have dozens of existing disable comments that would need to be refactored
			ts: "@typescript-eslint",
			style: "@stylistic",
			test: "vitest",
			import: "import-lite",
		}),
	)

	if (useOxlint) {
		pipeline.append(oxlint.buildFromOxlintConfigFile(oxlintConfigPath))
	}

	if (!hasNuxtPipeline) {
		pipeline.append(
			importX.flatConfigs.recommended as Linter.Config,
			importX.flatConfigs.typescript as Linter.Config,
		)
	}

	/**
	 * alan/config — TypeScript parser + jsdoc for TS/TSX files.
	 * alan/config-vue — jsdoc for .vue files (no parser override).
	 *
	 * Split because tsParser (@typescript-eslint/parser) cannot parse
	 * Vue SFC files — it chokes on <template>/<script>/<style> blocks.
	 * Setting tsParser as the parser on a .vue file causes parse errors.
	 * The Nuxt pipeline (withNuxt / createConfigForNuxt) already handles
	 * Vue parsing via vue-eslint-parser, so we only add jsdoc settings
	 * without overriding the parser on .vue files.
	 */
	pipeline.append({
		name: "alan/config",
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parserOptions: {
				// https://www.npmjs.com/package/eslint-plugin-import-x#resolvers
				parser: tsParser,
				tsconfigRootDir: rootPath,
				projectService: {
					defaultProject: "tsconfig.json",
					allowDefaultProject,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: (hasNuxtPipeline && !isNuxtModule)
			? {}
			: { jsdoc: jsdocPlugin as any },
		settings: (hasNuxtPipeline && !isNuxtModule)
			? {}
			: {
					jsdoc: {
						mode: "typescript",
						maxLines: 0,
					},
				},
	})

	pipeline.append({
		name: "alan/config-vue",
		files: ["**/*.vue"],
		plugins: (hasNuxtPipeline && !isNuxtModule)
			? {}
			: { jsdoc: jsdocPlugin as any },
		settings: (hasNuxtPipeline && !isNuxtModule)
			? {}
			: {
					jsdoc: {
						mode: "typescript",
						maxLines: 0,
					},
				},
	})

	pipeline.append({
		name: "alan/stories",
		files: ["**/*.stories.*"],
		rules: {
			"@typescript-eslint/explicit-function-return-type": "off",
			"no-restricted-imports": "off",
		},
	})
	pipeline.append({
		name: "alan/test-overrides",
		files: ["**/test/**", "**/tests/**", "**/*.test.*", "**/*.spec.*"],
		rules: {
			"no-console": "off",
			"@typescript-eslint/no-unused-expressions": "off",
			"@typescript-eslint/no-unused-vars": "off",
		},
	})

	pipeline.append({
		name: "alan/global-ignores",
		ignores: [".direnv/**/*", ".devenv/**/*", "node_modules/**"],
	})

	pipeline.overrideRules({
		"@typescript-eslint/naming-convention": [
			"warn",
			{ selector: ["default"], format: null, ...allowAnyUnderscores, filter: { ...fixExceptions.filter, match: true } },
			{ selector: ["default"], format: ["strictCamelCase"], ...allowSingleUnderscores, ...fixExceptions },
			{ selector: "import", format: ["strictCamelCase", "PascalCase"], ...allowAnyUnderscores },
			{ selector: "default", modifiers: ["unused"], format: ["strictCamelCase", "UPPER_CASE"], ...requireLeadingUnderscore, ...fixExceptions },
			{ selector: ["enumMember", "typeProperty"], format: ["strictCamelCase", "UPPER_CASE"], ...allowSingleUnderscores, ...fixExceptions },
			{ selector: ["objectLiteralProperty", "property"], format: null, ...allowAnyUnderscores, ...fixExceptions },
			{ selector: "variable", format: ["strictCamelCase", "UPPER_CASE"], ...allowSingleUnderscores, ...fixExceptions },
			{ selector: "memberLike", modifiers: ["private"], format: ["camelCase"], ...requireLeadingUnderscore, ...fixExceptions },
			{ selector: "memberLike", modifiers: ["public"], format: ["camelCase"], ...forbidUnderscores, ...fixExceptions },
			{ selector: "typeLike", format: ["StrictPascalCase"], ...forbidUnderscores },
			{ selector: "typeParameter", format: ["StrictPascalCase"], prefix: ["T"], ...forbidUnderscores },
			{ selector: "enum", format: null, custom: { match: true, regex: "^(?<UPPER_Maybe_PascalCase>(?!_[a-z])_*[A-Za-z]+(?!_[a-z])_*)+$" }, ...allowSingleUnderscores },
			{ selector: ["default"], format: null, leadingUnderscore: "allow", trailingUnderscore: "allow", custom: { regex: "^HTML", match: true } },
		],
		"import-x/no-cycle": "warn",
		"import-x/no-absolute-path": "warn",
		"no-duplicate-imports": "off",
		"import-x/no-duplicates": ["warn", { considerQueryString: true }],
		"import-x/no-extraneous-dependencies": ["warn", {
			devDependencies: ["!src/**/*"],
			optionalDependencies: true,
			peerDependencies: true,
		}],
		"import-x/no-useless-path-segments": ["warn", { noUselessIndex: false }],
		"import-x/consistent-type-specifier-style": ["warn", "prefer-top-level"],
		"no-restricted-imports": ["warn", {
			patterns: [
				{
					group: ["*/index.js", "!types/index.js"],
					message: "Avoid importing from index files to avoid circular dependencies.",
				},
			],
		}],
		"antfu/import-dedupe": "warn",
		"@typescript-eslint/no-unused-vars": ["warn", { vars: "all", args: "after-used", ignoreRestSiblings: false, argsIgnorePattern: "^_" }],
		"no-console": ["warn", { allow: ["warn", "error"] }],
		"curly": ["warn", "multi-line"],
		"antfu/top-level-function": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/unified-signatures": "off",
		"prefer-template": "warn",
		"@typescript-eslint/ban-ts-comment": ["warn", { minimumDescriptionLength: 1 }],
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-empty-object-type": ["warn", { allowInterfaces: "always" }],
		"jsdoc/check-tag-names": ["warn", { definedTags: ["vue-ignore", "experimental"] }],
		"antfu/no-top-level-await": "off",
		"@stylistic/brace-style": ["warn", "1tbs", { allowSingleLine: true }],
		// apps don't need explicit return types — they're not library surfaces
		...(type === "app" ? { "@typescript-eslint/explicit-function-return-type": "off" } : {}),
		// to painful to migrate right now
		"node/prefer-global/process": "off",
		"@stylistic/no-multiple-empty-lines": ["warn", { max: 2 }],
		"@stylistic/max-statements-per-line": "off",
		"@typescript-eslint/unbound-method": ["off", { ignoreStatic: true }], // not good enough, annoying, this is rarely an issue anyways, usually errors straight away
		"@typescript-eslint/no-redundant-type-constituents": "off", // i like to be explicit it can take any | Promise<any>
		"@typescript-eslint/restrict-template-expressions": "off", // unknown errors have to be logged somehow, todo make some wrapper and then enable this
		...(useOxlint
			? {
					"@typescript-eslint/no-dynamic-delete": "off", // oxlint handles it but its not getting turned off for some reason...
				}
			: {}),
		"e18e/prefer-static-regex": "off",
	},
	)

	if (vue) {
		pipeline.append({
			name: "alan/vue-rules",
			files: ["**/*.vue"],
			rules: {
				"vue/attribute-hyphenation": ["warn", "always"],
				"vue/component-definition-name-casing": ["warn", "kebab-case"],
				"vue/prop-name-casing": ["warn", "camelCase"],
				"vue/v-bind-style": ["warn", "shorthand"],
				"vue/v-on-style": ["warn", "shorthand"],
				"vue/html-closing-bracket-newline": ["warn", { singleline: "never", multiline: "always" }],
				"vue/html-indent": ["warn", "tab", { attribute: 1, baseIndent: 0, closeBracket: 0, alignAttributesVertically: false }],
				"vue/block-order": ["warn", { order: [["docs"], "template", "script", "style"] }],
				"vue/block-tag-newline": ["warn", { maxEmptyLines: 0 }],
				"vue/this-in-template": ["warn", "never"],
				"vue/no-dupe-keys": "warn",
				"vue/require-default-prop": "warn",
				"vue/require-prop-types": "warn",
				"vue/no-v-html": "warn",
			},
		})
	}

	if (isNuxtModule) {
		pipeline.append({
			name: "alan/nuxt-module",
			files: ["**/*.{ts,vue}"],
			rules: {
				"@stylistic/arrow-parens": ["warn", "always"],
			},
		})
	}

	if (extendCb) {
		extendCb(pipeline)
	}
	return pipeline
}

const _config = await createConfig({})

export default _config as any as Linter.Config[]
