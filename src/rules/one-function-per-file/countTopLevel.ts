import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import type { TSESTree } from "@typescript-eslint/utils"

export function countTopLevel(body: TSESTree.ProgramStatement[]): { exported: number, total: number } {
	const exportedNames: string[] = []

	for (const statement of body) {
		if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration) {
			for (const specifier of statement.specifiers) {
				if (specifier.local.type === AST_NODE_TYPES.Identifier) exportedNames.push(specifier.local.name)
			}
		}
	}

	let exported = 0
	let total = 0
	const signatures = new Map<string, boolean>()

	const count = (name: string | undefined, isExported: boolean) => {
		total++

		if (isExported || (name !== undefined && exportedNames.includes(name))) exported++
	}

	for (const statement of body) {
		let declaration: TSESTree.Node | null = statement
		let isExported = false

		if (statement.type === AST_NODE_TYPES.ExportNamedDeclaration || statement.type === AST_NODE_TYPES.ExportDefaultDeclaration) {
			declaration = statement.declaration
			isExported = true
		}

		if (declaration === null) continue

		if (declaration.type === AST_NODE_TYPES.TSDeclareFunction) {
			const name = declaration.id?.name

			if (name === undefined) {
				count(undefined, isExported)
			} else {
				const previous = signatures.get(name)
				signatures.set(name, previous === undefined ? isExported : previous || isExported)
			}

			continue
		}

		if (declaration.type === AST_NODE_TYPES.FunctionDeclaration) {
			const name = declaration.id?.name

			if (name === undefined) {
				count(undefined, isExported)
			} else {
				const previous = signatures.get(name)

				if (previous === undefined) {
					count(name, isExported)
				} else {
					count(name, isExported || previous)
					signatures.delete(name)
				}
			}

			continue
		}

		if (declaration.type === AST_NODE_TYPES.ClassDeclaration) {
			count(declaration.id?.name, isExported)
			continue
		}

		if (declaration.type === AST_NODE_TYPES.VariableDeclaration && declaration.kind !== "using") {
			for (const declarator of declaration.declarations) {
				const init = declarator.init

				if (init?.type === AST_NODE_TYPES.ArrowFunctionExpression || init?.type === AST_NODE_TYPES.FunctionExpression) {
					count(declarator.id.type === AST_NODE_TYPES.Identifier ? declarator.id.name : undefined, isExported)
				}
			}
		}
	}

	for (const [name, isExported] of signatures) {
		count(name, isExported)
	}

	return { exported, total }
}
