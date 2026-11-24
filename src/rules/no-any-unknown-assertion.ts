import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils"

export const noAnyUnknownAssertion = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Disallow asserting to `any`, `unknown`, or a union containing them."
		},
		schema: [],
		messages: {
			anyUnknownAssertion: "Avoid asserting to `any`, `unknown`, or a union containing them."
		}
	},
	defaultOptions: [],
	create(context) {
		return {
			[AST_NODE_TYPES.TSAsExpression](node) {
				const asserted = node.typeAnnotation

				if (
					asserted.type === AST_NODE_TYPES.TSAnyKeyword
					|| asserted.type === AST_NODE_TYPES.TSUnknownKeyword
					|| (asserted.type === AST_NODE_TYPES.TSUnionType && asserted.types.some(
						member => member.type === AST_NODE_TYPES.TSAnyKeyword || member.type === AST_NODE_TYPES.TSUnknownKeyword
					))
				) {
					context.report({ node, messageId: "anyUnknownAssertion" })
				}
			}
		}
	}
})
