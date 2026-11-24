import type { Linter } from "eslint"

export function custom(): Linter.Config[] {
	return [
		{
			name: "alan/custom",
			rules: {
				"alan/no-ai-comment-prefix": "error"
			}
		}
	]
}
