import e18e from "@e18e/eslint-plugin"
import eslintComments from "@eslint-community/eslint-plugin-eslint-comments"
import nuxt from "@nuxt/eslint-plugin"
import stylistic from "@stylistic/eslint-plugin"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import antfuPlugin from "eslint-plugin-antfu"
import commandPlugin from "eslint-plugin-command"
import { importX } from "eslint-plugin-import-x"
import jsdocPlugin from "eslint-plugin-jsdoc"
import jsonc from "eslint-plugin-jsonc"
import node from "eslint-plugin-n"
import perfectionist from "eslint-plugin-perfectionist"
import pnpmPlugin from "eslint-plugin-pnpm"
import regexp from "eslint-plugin-regexp"
import unicorn from "eslint-plugin-unicorn"
import unusedImports from "eslint-plugin-unused-imports"
import vue from "eslint-plugin-vue"
import yaml from "eslint-plugin-yml"
import { localRules } from "./rules/index.js"

export const plugins = {
	"@typescript-eslint": tsPlugin,
	"@stylistic": stylistic,
	antfu: antfuPlugin,
	command: commandPlugin,
	e18e,
	"eslint-comments": eslintComments,
	"@eslint-community/eslint-comments": eslintComments,
	alan: localRules,
	"import-x": importX,
	jsdoc: jsdocPlugin,
	jsonc,
	node,
	nuxt,
	perfectionist,
	pnpm: pnpmPlugin,
	regexp,
	unicorn,
	"unused-imports": unusedImports,
	vue,
	yaml
} as unknown as Record<string, any>
