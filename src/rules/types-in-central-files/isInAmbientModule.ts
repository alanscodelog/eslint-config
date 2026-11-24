import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import type { TSESTree } from "@typescript-eslint/utils"

export function isInAmbientModule(node: TSESTree.Node): boolean {
	for (let parent = node.parent; parent; parent = parent.parent) {
		if (
			parent.type === AST_NODE_TYPES.TSModuleDeclaration
			&& parent.declare
			&& (parent.kind === "global" || parent.kind === "module")
		) return true
	}

	return false
}
