import { AST_NODE_TYPES, ESLintUtils } from "@typescript-eslint/utils"
import type { TSESTree } from "@typescript-eslint/utils"
import path from "node:path"
import { matchesAnyGlob } from "../shared/matchesAnyGlob.js"
import { isInAmbientModule } from "./isInAmbientModule.js"
import { isTypeReexport } from "./isTypeReexport.js"

export const typesInCentralFiles = ESLintUtils.RuleCreator.withoutDocs({
	meta: {
		type: "problem",
		docs: {
			description: "Require type declarations in central types files."
		},
		schema: [
			{
				type: "object",
				properties: {
					typesGlobs: {
						type: "array",
						items: {
							type: "string"
						}
					},
					indexGlobs: {
						type: "array",
						items: {
							type: "string"
						}
					},
					message: {
						type: "string"
					}
				},
				additionalProperties: false
			}
		],
		messages: {
			typesInCentralFiles: "{{message}}"
		}
	},
	defaultOptions: [
		{
			typesGlobs: ["**/types.ts", "**/types/**/*.ts"],
			indexGlobs: ["**/index.ts"],
			message: "Avoid declaring types here. For short types, prefer inlining them unless they need to be exported. All other types should go in the appropriate types.ts file."
		}
	],
	create(context, [{ typesGlobs, indexGlobs, message }]) {
		const filePath = path.relative(context.cwd, path.resolve(context.cwd, context.filename)).replace(/\\/g, "/")

		if (filePath.endsWith(".d.ts")) return {}

		const typesAllowed = matchesAnyGlob(filePath, typesGlobs)
		const indexAllowed = matchesAnyGlob(filePath, indexGlobs)

		const report = (node: TSESTree.Node) => {
			if (isInAmbientModule(node)) return

			context.report({ node, messageId: "typesInCentralFiles", data: { message } })
		}

		const reportDeclaration = (node: TSESTree.Node) => {
			if (!typesAllowed) report(node)
		}

		return {
			[AST_NODE_TYPES.TSInterfaceDeclaration](node) {
				reportDeclaration(node)
			},
			[AST_NODE_TYPES.TSTypeAliasDeclaration](node) {
				reportDeclaration(node)
			},
			[AST_NODE_TYPES.TSEnumDeclaration](node) {
				reportDeclaration(node)
			},
			[AST_NODE_TYPES.ExportNamedDeclaration](node) {
				if (!typesAllowed && !indexAllowed && isTypeReexport(node)) report(node)
			}
		}
	}
})
