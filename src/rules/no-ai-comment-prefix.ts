import { ESLintUtils } from "@typescript-eslint/utils"

export const noAiCommentPrefix = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Disallow comments that start with the AI: prefix."
		},
		schema: [],
		messages: {
			aiCommentPrefix: "Delete this comment if it restates the code. Keep it if it explains why. Never remove the `AI:` prefix. Removing it is the human approval step."
		}
	},
	defaultOptions: [],
	create(context) {
		for (const comment of context.sourceCode.getAllComments()) {
			if (comment.value.replace(/^[\s*]+/, "").startsWith("AI:")) {
				context.report({ node: comment, messageId: "aiCommentPrefix" })
			}
		}

		return {}
	}
})
