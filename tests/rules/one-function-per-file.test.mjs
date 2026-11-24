import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Linter } from "eslint"
import { createConfig } from "../../dist/config.mjs"

const allowDefaultProject = [
	"src/*.ts",
	"src/*/*.ts",
	"src/*/*/*.ts",
	"src/*/*.vue",
	"src/*/*.vue/*.ts"
]
const config = [
	...(await createConfig({ type: "lib" })),
	{
		languageOptions: {
			parserOptions: {
				projectService: {
					defaultProject: "tsconfig.json",
					allowDefaultProject,
					maximumDefaultProjectFileMatchCount_THIS_WILL_SLOW_DOWN_LINTING: 20
				}
			}
		}
	}
]
const linter = new Linter()
const exportedRule = "alan/one-exported-function-per-file"
const totalRule = "alan/one-function-per-file"
const exported = {
	ruleId: exportedRule,
	message: "This file exports too many functions or classes. Move one to another file.",
	messageId: "exportedBudget",
	severity: 2
}
const warning = {
	ruleId: totalRule,
	message: "This file has too many functions or classes. Move one to another file.",
	messageId: "fileBudget",
	severity: 1
}

function reports(code, filename, options) {
	const activeConfig = options
		? [
			...config,
			{
				rules: {
					[exportedRule]: ["error", options],
					[totalRule]: ["warn", options]
				}
			}
		]
		: config

	return linter.verify(code, activeConfig, filename).filter(
		result => result.ruleId === exportedRule || result.ruleId === totalRule
	)
}

function assertValid(code, filename, options) {
	assert.deepEqual(reports(code, filename, options), [])
}

function assertInvalid(code, line, filename, expected, options) {
	const found = reports(code, filename, options)
	assert.equal(found.length, 1)
	assert.equal(found[0].ruleId, expected.ruleId)
	assert.equal(found[0].message, expected.message)
	assert.equal(found[0].messageId, expected.messageId)
	assert.equal(found[0].severity, expected.severity)
	assert.equal(found[0].line, line)
	assert.equal(found[0].fix, undefined)
}

describe("alan/one-function-per-file", () => {
	it("two exported functions", () => {
		assertInvalid("export function a() {}\nexport function b() {}", 1, "src/features/auth/login.ts", exported)
	})

	it("exported and unexported", () => {
		assertInvalid("export function a() {}\nfunction b() {}", 1, "src/features/auth/login.ts", warning)
	})

	it("two unexported", () => {
		assertInvalid("function a() {}\nfunction b() {}", 1, "src/features/auth/login.ts", warning)
	})

	it("one exported", () => {
		assertValid("export function a() {}", "src/features/auth/login.ts")
	})

	it("one unexported", () => {
		assertValid("function a() {}", "src/features/auth/login.ts")
	})

	it("default exported function", () => {
		assertValid("export default function a() {}", "src/features/auth/login.ts")
	})

	it("exported class", () => {
		assertValid("export class Service {}", "src/features/auth/login.ts")
	})

	it("class members", () => {
		assertValid(`export class Service {
	constructor() {}
	get value() { return 1 }
	run() {}
	handle = () => {}
}`, "src/features/auth/login.ts")
	})

	it("const arrow", () => {
		assertInvalid("export function a() {}\nconst b = () => {}", 1, "src/features/auth/login.ts", warning)
	})

	it("const function expression", () => {
		assertInvalid("export function a() {}\nconst b = function () {}", 1, "src/features/auth/login.ts", warning)
	})

	it("let arrow", () => {
		assertInvalid("export function a() {}\nlet b = () => {}", 1, "src/features/auth/login.ts", warning)
	})

	it("var function expression", () => {
		assertInvalid("export function a() {}\nvar b = function () {}", 1, "src/features/auth/login.ts", warning)
	})

	it("nested functions", () => {
		assertValid(`export function a() {
	const nested = () => {}
	const config = {
		handler: () => {},
		run() {}
	}
	return [1].map(item => item + Number(nested(config)))
}`, "src/features/auth/login.ts")
	})

	it("export specifier", () => {
		assertInvalid(`function a() {}
function b() {}
function c() {}
export { a, b }`, 1, "src/features/auth/login.ts", exported)
	})

	it("overloads", () => {
		assertValid(`export function load(id: string): string
export function load(id: number): number
export function load(id: string | number): string | number {
	return id
}`, "src/features/auth/login.ts")
	})

	it("declaration file", () => {
		assertValid("export declare function a(): void\nexport declare function b(): void", "src/globals.d.ts")
	})

	it("ignore glob", () => {
		const options = { ignore: ["**/auth/**"] }
		assertValid("export function a() {}\nexport function b() {}", "src/features/auth/login.ts", options)
		assertInvalid("export function a() {}\nexport function b() {}", 1, "src/features/other/login.ts", exported, options)
	})

	it("max two", () => {
		const options = { max: 2 }
		assertValid("export function a() {}\nexport function b() {}", "src/features/auth/login.ts", options)
		assertInvalid("export function a() {}\nexport function b() {}\nexport function c() {}", 1, "src/features/auth/login.ts", exported, options)
	})

	it("max two with unexported", () => {
		assertInvalid("export function a() {}\nexport function b() {}\nfunction c() {}", 1, "src/features/auth/login.ts", warning, { max: 2 })
	})
})
