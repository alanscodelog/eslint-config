import type { TSESTree } from "@typescript-eslint/utils"

export function isTypeReexport(node: TSESTree.ExportNamedDeclaration): boolean {
	return node.source !== null
		&& (
			node.exportKind === "type"
			|| node.specifiers.some(specifier => specifier.exportKind === "type")
		)
}
