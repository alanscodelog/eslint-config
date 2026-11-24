import type { Linter } from "eslint"

export function custom(): Linter.Config[] {
	return [
		{
			name: "alan/custom",
			rules: {
				"alan/no-ai-comment-prefix": "error",
				"alan/no-any-unknown-assertion": "error",
				"alan/no-empty-catch": "error",
				"alan/one-exported-function-per-file": "error",
				"alan/one-function-per-file": "warn",
				"alan/types-in-central-files": "error"
			}
		}
	]
}
