import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Linter } from "eslint"
import { createConfig } from "../../dist/config.mjs"

const config = await createConfig({ type: "lib" })
const linter = new Linter()
const message = "Delete this comment if it restates the code. Keep it if it explains why. Never remove the `AI:` prefix. Removing it is the human approval step."

function reports(code) {
	return linter.verify(code, config, "test.ts").filter(
		result => result.ruleId === "alan/no-ai-comment-prefix"
	)
}

function assertValid(code) {
	assert.deepEqual(reports(code), [])
}

function assertInvalid(code, line) {
	const found = reports(code)
	assert.equal(found.length, 1)
	assert.equal(found[0].message, message)
	assert.equal(found[0].severity, 2)
	assert.equal(found[0].line, line)
	assert.equal(found[0].fix, undefined)
}

describe("alan/no-ai-comment-prefix", () => {
	it("no comment", () => {
		assertValid("export const value = 1")
	})

	it("mid line prefix", () => {
		assertValid("// note AI: reason\nexport const value = 1")
	})

	it("block later line", () => {
		assertValid("/*\n * note\n * AI: reason\n */\nexport const value = 1")
	})

	it("jsdoc later line", () => {
		assertValid("/**\n * note\n * AI: reason\n */\nexport const value = 1")
	})

	it("line comment", () => {
		assertInvalid("// AI: reason\nexport const value = 1", 1)
	})

	it("tight line comment", () => {
		assertInvalid("//AI: reason\nexport const value = 1", 1)
	})

	it("block comment", () => {
		assertInvalid("/* AI: reason */\nexport const value = 1", 1)
	})

	it("one line jsdoc", () => {
		assertInvalid("/** AI: reason */\nexport const value = 1", 1)
	})

	it("multiline jsdoc", () => {
		assertInvalid("/**\n * AI: reason\n */\nexport const value = 1", 1)
	})
})
