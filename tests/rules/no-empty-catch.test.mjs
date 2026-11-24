import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Linter } from "eslint"
import { createConfig } from "../../dist/config.mjs"

const config = await createConfig({ type: "lib" })
const linter = new Linter()
const message = "Empty catch blocks are forbidden without explicit user approval."

function reports(code) {
	return linter.verify(code, config, "test.ts").filter(
		result => result.ruleId === "alan/no-empty-catch"
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

describe("alan/no-empty-catch", () => {
	it("empty statement", () => {
		assertValid("try { risky() } catch (e) { ; }")
	})

	it("throw", () => {
		assertValid("try { risky() } catch (e) { throw e }")
	})

	it("console error", () => {
		assertValid("try { risky() } catch (e) { console.error(e) }")
	})

	it("clean expression", () => {
		assertValid("export const value = 1")
	})

	it("empty with binding", () => {
		assertInvalid("try { risky() } catch (e) {}", 1)
	})

	it("empty without binding", () => {
		assertInvalid("try { risky() } catch {}", 1)
	})

	it("block comment", () => {
		assertInvalid(`try {
	risky()
} catch (e) {
	/* ignored */
}`, 3)
	})

	it("line comment", () => {
		assertInvalid(`try {
	risky()
} catch (e) {
	// ignored
}`, 3)
	})
})
