import type { TSESLint } from "@typescript-eslint/utils"
import { noAiCommentPrefix } from "./no-ai-comment-prefix.js"
import { noAnyUnknownAssertion } from "./no-any-unknown-assertion.js"
import { noEmptyCatch } from "./no-empty-catch.js"
import { typesInCentralFiles } from "./types-in-central-files.js"

export const localRules = {
	rules: {
		"no-ai-comment-prefix": noAiCommentPrefix,
		"no-any-unknown-assertion": noAnyUnknownAssertion,
		"no-empty-catch": noEmptyCatch,
		"types-in-central-files": typesInCentralFiles
	}
} satisfies TSESLint.FlatConfig.Plugin
