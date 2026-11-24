import type { Linter } from "eslint"
import { configs as yamlConfigs } from "eslint-plugin-yml"
import type { ResolvedOptions } from "../types.js"

export function yaml(_opts: ResolvedOptions): Linter.Config[] {
	return yamlConfigs["flat/recommended"]
}
