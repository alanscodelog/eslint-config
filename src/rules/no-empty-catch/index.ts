import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils"

export const noEmptyCatch = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Disallow empty catch blocks."
		},
		schema: [],
		messages: {
			emptyCatch: "Empty catch blocks are forbidden without explicit user approval."
		}
	},
	defaultOptions: [],
	create(context) {
		return {
			[AST_NODE_TYPES.CatchClause](node) {
				if (node.body.body.length === 0) {
					context.report({ node, messageId: "emptyCatch" })
				}
			}
		}
	}
})
