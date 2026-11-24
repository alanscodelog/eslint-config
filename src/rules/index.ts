import type { TSESLint } from "@typescript-eslint/utils"
import { noAiCommentPrefix } from "./no-ai-comment-prefix.js"
import { noAnyUnknownAssertion } from "./no-any-unknown-assertion.js"

export const localRules = {
	rules: {
		"no-ai-comment-prefix": noAiCommentPrefix,
		"no-any-unknown-assertion": noAnyUnknownAssertion
	}
} satisfies TSESLint.FlatConfig.Plugin
