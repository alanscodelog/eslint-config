import type { ESLint } from "eslint"
import { noAiCommentPrefix } from "./no-ai-comment-prefix.js"

export const localRules = {
	rules: {
		"no-ai-comment-prefix": noAiCommentPrefix
	}
} satisfies ESLint.Plugin
