import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils"
import { countTopLevel } from "./countTopLevel.js"
import { isExemptFile } from "./isExemptFile.js"

const schema = [
	{
		type: "object",
		properties: {
			max: {
				type: "integer"
			},
			ignore: {
				type: "array",
				items: {
					type: "string"
				}
			}
		},
		additionalProperties: false
	}
] as const

export const oneExportedFunctionPerFile = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Limit exported top-level functions and classes per file."
		},
		schema,
		messages: {
			exportedBudget: "This file exports too many functions or classes. Move one to another file."
		}
	},
	defaultOptions: [{ max: 1, ignore: [] }],
	create(context, [{ max, ignore }]) {
		if (isExemptFile(context.filename, context.cwd, ignore)) return {}

		return {
			[AST_NODE_TYPES.Program](node) {
				const counts = countTopLevel(node.body)

				if (counts.exported > max) context.report({ node, messageId: "exportedBudget" })
			}
		}
	}
})

export const oneFunctionPerFile = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Limit all top-level functions and classes per file."
		},
		schema,
		messages: {
			fileBudget: "This file has too many functions or classes. Move one to another file."
		}
	},
	defaultOptions: [{ max: 1, ignore: [] }],
	create(context, [{ max, ignore }]) {
		if (isExemptFile(context.filename, context.cwd, ignore)) return {}

		return {
			[AST_NODE_TYPES.Program](node) {
				const counts = countTopLevel(node.body)

				if (counts.exported <= max && counts.total > max) context.report({ node, messageId: "fileBudget" })
			}
		}
	}
})
