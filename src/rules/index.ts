import type { TSESLint } from "@typescript-eslint/utils"
import { noAiCommentPrefix } from "./no-ai-comment-prefix/index.js"
import { noAnyUnknownAssertion } from "./no-any-unknown-assertion/index.js"
import { noEmptyCatch } from "./no-empty-catch/index.js"
import { oneExportedFunctionPerFile, oneFunctionPerFile } from "./one-function-per-file/index.js"
import { typesInCentralFiles } from "./types-in-central-files/index.js"

export const localRules = {
	rules: {
		"no-ai-comment-prefix": noAiCommentPrefix,
		"no-any-unknown-assertion": noAnyUnknownAssertion,
		"no-empty-catch": noEmptyCatch,
		"one-exported-function-per-file": oneExportedFunctionPerFile,
		"one-function-per-file": oneFunctionPerFile,
		"types-in-central-files": typesInCentralFiles
	}
} satisfies TSESLint.FlatConfig.Plugin
