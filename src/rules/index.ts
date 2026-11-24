import type { TSESLint } from "@typescript-eslint/utils"
import { noAiCommentPrefix } from "./no-ai-comment-prefix.js"
import { noAnyUnknownAssertion } from "./no-any-unknown-assertion.js"
import { noEmptyCatch } from "./no-empty-catch.js"

export const localRules = {
	rules: {
		"no-ai-comment-prefix": noAiCommentPrefix,
		"no-any-unknown-assertion": noAnyUnknownAssertion,
		"no-empty-catch": noEmptyCatch
	}
} satisfies TSESLint.FlatConfig.Plugin
