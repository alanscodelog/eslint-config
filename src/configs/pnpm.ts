import type { Linter } from "eslint"
import { configs as pnpmConfigs } from "eslint-plugin-pnpm"
import type { ResolvedOptions } from "../options.js"

const deltas = {
	"pnpm/json-enforce-catalog": [ "warn",
		{
			autofix: true,
			ignores: [
				"@types/vscode"
			],
			reuseExistingCatalog: true,
			conflicts: "new-catalog",
			fields: [
				"dependencies",
				"devDependencies"
			]
		}
	],
	"pnpm/json-prefer-workspace-settings": [ "warn",
		{
			autofix: true
		}
	],
	"pnpm/json-valid-catalog": [ "warn",
		{
			autofix: true,
			autoInsert: true,
			autoInsertDefaultSpecifier: "^0.0.0",
			enforceNoConflict: true,
			fields: [
				"dependencies",
				"devDependencies",
				"optionalDependencies",
				"peerDependencies",
				"resolutions",
				"overrides",
				"pnpm.overrides"
			]
		}
	]
} satisfies Linter.RulesRecord

export function pnpm(_opts: ResolvedOptions): Linter.Config[] {
	const recommended = pnpmConfigs.recommended
	return recommended.map(c => ({
		...c,
		name: "alan/pnpm",
		rules: {
			...c.rules,
			...deltas
		}
	}))
}
