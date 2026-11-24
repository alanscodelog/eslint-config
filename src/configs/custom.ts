import type { Linter } from "eslint"

export function custom(): Linter.Config[] {
	return [
		{
			name: "alan/custom",
			rules: {
				"alan/no-ai-comment-prefix": "error",
				"alan/no-any-unknown-assertion": "error",
				"alan/no-empty-catch": "error",
				"alan/types-in-central-files": "error"
			}
		}
	]
}
