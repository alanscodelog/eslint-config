import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Linter } from "eslint"
import { createConfig } from "../../dist/config.mjs"

const config = await createConfig({ type: "lib" })
const linter = new Linter()
const message = "Avoid asserting to `any`, `unknown`, or a union containing them."

function reports(code) {
	return linter.verify(code, config, "test.ts").filter(
		result => result.ruleId === "alan/no-any-unknown-assertion"
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

describe("alan/no-any-unknown-assertion", () => {
	it("array type", () => {
		assertValid("x as any[]")
	})

	it("generic array", () => {
		assertValid("x as Array<unknown>")
	})

	it("promise generic", () => {
		assertValid("x as Promise<any>")
	})

	it("record generic", () => {
		assertValid("x as Record<string, any>")
	})

	it("object property", () => {
		assertValid("x as { id: unknown }")
	})

	it("const assertion", () => {
		assertValid("x as const")
	})

	it("clean expression", () => {
		assertValid("export const value = 1")
	})

	it("any assertion", () => {
		assertInvalid("x as any", 1)
	})

	it("unknown assertion", () => {
		assertInvalid("x as unknown", 1)
	})

	it("any union", () => {
		assertInvalid("x as any | null", 1)
	})

	it("unknown union", () => {
		assertInvalid("x as unknown | string", 1)
	})

	it("unknown chain", () => {
		assertInvalid("x as unknown as User", 1)
	})

	it("any chain", () => {
		assertInvalid("x as any as string as number", 1)
	})
})
