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
	...(await createConfig({ type: "lib", vue: true })),
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
const message = "Avoid declaring types here. For short types, prefer inlining them unless they need to be exported. All other types should go in the appropriate types.ts file."

function reports(code, filename, options) {
	const activeConfig = options
		? [
			...config,
			{
				rules: {
					"alan/types-in-central-files": ["error", options]
				}
			}
		]
		: config

	return linter.verify(code, activeConfig, filename).filter(
		result => result.ruleId === "alan/types-in-central-files"
	)
}

function assertValid(code, filename, options) {
	assert.deepEqual(reports(code, filename, options), [])
}

function assertInvalid(code, line, filename, options, expectedMessage = message) {
	const found = reports(code, filename, options)
	assert.equal(found.length, 1)
	assert.equal(found[0].message, expectedMessage)
	assert.equal(found[0].severity, 2)
	assert.equal(found[0].line, line)
	assert.equal(found[0].fix, undefined)
}

describe("alan/types-in-central-files", () => {
	it("interface", () => {
		assertInvalid("interface LoginState { id: string }", 1, "src/features/auth/login.ts")
	})

	it("exported interface", () => {
		assertInvalid("export interface LoginState { id: string }", 1, "src/features/auth/login.ts")
	})

	it("type alias", () => {
		assertInvalid("type LoginState = { id: string }", 1, "src/features/auth/login.ts")
	})

	it("enum", () => {
		assertInvalid("enum Status { Active }", 1, "src/features/auth/login.ts")
	})

	it("nested declaration", () => {
		assertInvalid(`function load() {
	interface Nested { id: string }
}`, 2, "src/features/auth/login.ts")
	})

	it("export type statement", () => {
		assertInvalid('export type { Foo } from "./foo"', 1, "src/features/auth/login.ts")
	})

	it("export specifier type", () => {
		assertInvalid('export { type Foo } from "./foo"', 1, "src/features/auth/login.ts")
	})

	it("feature types file", () => {
		assertValid("interface LoginState { id: string }", "src/features/auth/types.ts")
	})

	it("root types file", () => {
		assertValid("interface LoginState { id: string }", "src/types.ts")
	})

	it("types directory", () => {
		assertValid("interface Nested { id: string }", "src/types/nested.ts")
	})

	it("index reexport", () => {
		assertValid('export type { Foo } from "./foo"', "src/features/auth/index.ts")
	})

	it("types file reexport", () => {
		assertValid('export type { Foo } from "./foo"', "src/features/auth/types.ts")
	})

	it("declare global", () => {
		assertValid(`declare global {
	interface Window { userId: string }
}`, "src/globals.ts")
	})

	it("type beside declare global", () => {
		assertInvalid(`declare global {
	interface Window { userId: string }
}

interface Outside { id: string }`, 5, "src/globals.ts")
	})

	it("declare module", () => {
		assertValid(`declare module "some-lib" {
	interface SomeOptions { retry: boolean }
}`, "src/modules.ts")
	})

	it("type beside declare module", () => {
		assertInvalid(`declare module "some-lib" {
	interface SomeOptions { retry: boolean }
}

interface Outside { id: string }`, 5, "src/modules.ts")
	})

	it("declaration file", () => {
		assertValid("interface Ambient { id: string }", "src/globals.d.ts")
	})

	it("vue interface", () => {
		assertInvalid(`<script lang="ts">
interface Props { id: string }
</script>`, 2, "src/components/Widget.vue")
	})

	it("vue type alias", () => {
		assertInvalid(`<script lang="ts">
type Row = { id: string }
</script>`, 2, "src/components/Widget.vue")
	})

	it("const object", () => {
		assertValid('export const config = { id: "login" }', "src/features/auth/login.ts")
	})

	it("class", () => {
		assertValid("export class LoginService {}", "src/features/auth/login.ts")
	})

	it("custom types globs", () => {
		assertValid("interface LoginState { id: string }", "src/features/auth/custom-types.ts", {
			typesGlobs: ["**/custom-types.ts"]
		})
		assertInvalid("interface LoginState { id: string }", 1, "src/features/auth/types.ts", {
			typesGlobs: ["**/custom-types.ts"]
		})
	})

	it("custom index globs", () => {
		assertValid('export type { Foo } from "./foo"', "src/features/auth/barrel.ts", {
			indexGlobs: ["**/barrel.ts"]
		})
		assertInvalid('export type { Foo } from "./foo"', 1, "src/features/auth/index.ts", {
			indexGlobs: ["**/barrel.ts"]
		})
	})

	it("custom message", () => {
		assertInvalid("interface LoginState { id: string }", 1, "src/features/auth/login.ts", {
			message: "Use a types file."
		}, "Use a types file.")
	})
})
