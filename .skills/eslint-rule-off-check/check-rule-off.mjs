import { execFileSync } from "node:child_process"
import fs from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"

const rule = process.argv[2]
if (!rule) throw new Error("pass a rule id, for example no-console")

const root = process.cwd()
const require = createRequire(path.join(root, "package.json"))
const { ESLint } = require("eslint")
const configUrl = pathToFileURL(path.join(root, "dist/config.mjs")).href
const fixture = name => path.join(root, "tests", name)
const cases = [
	{ name: "lib", cwd: root, options: {} },
	{ name: "app", cwd: root, options: { type: "app" } },
	{ name: "vue-lib", cwd: root, options: { vue: true } },
	{ name: "vue-app", cwd: root, options: { vue: true, type: "app" } },
	{ name: "nuxt-app", cwd: fixture("nuxt-app"), options: { type: "app" } },
	{ name: "nuxt-module", cwd: fixture("nuxt-module"), options: { type: "lib" } }
]
const files = [
	"src/sample.ts",
	"sample.js",
	"sample.vue",
	"sample.stories.ts",
	"test/sample.test.ts",
	"playground/sample.ts",
	"config/nuxt.config.ts",
	"data.json",
	"sample.yaml"
]

const isOff = value => value === "off" || value === 0 || (Array.isArray(value) && value[0] === 0)

function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function removeOffDeclarations(text) {
	const escaped = escapeRegExp(rule)
	const linePattern = new RegExp(`^\\s*"${escaped}"\\s*:\\s*"off"(?:\\s*,\\s*)?\\r?\\n`, "gm")
	const inlinePattern = new RegExp(`"${escaped}"\\s*:\\s*"off"`, "g")
	return text.replace(linePattern, "").replace(inlinePattern, "")
}

function sourceFiles(dir) {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
		const target = path.join(dir, entry.name)
		if (entry.isDirectory()) return sourceFiles(target)
		return entry.name.endsWith(".ts") ? [target] : []
	})
}

async function effective(configs, cwd, file) {
	const eslint = new ESLint({
		cwd,
		overrideConfigFile: true,
		overrideConfig: configs
	})
	const resolved = (await eslint.calculateConfigForFile(file)).rules
	const value = resolved[rule]
	if (value === undefined || isOff(value)) return null
	return JSON.stringify(value)
}

async function collectValues(createConfigFn) {
	const values = new Map()
	for (const item of cases) {
		process.chdir(item.cwd)
		const configs = await createConfigFn(item.options)
		for (const file of files) {
			values.set(`${item.name} ${file}`, await effective(configs, item.cwd, file))
		}
	}
	return values
}

function printDiff(title, before, after) {
	console.log(title)
	for (const key of new Set([...before.keys(), ...after.keys()])) {
		const oldValue = before.get(key) ?? null
		const newValue = after.get(key) ?? null
		if (oldValue !== newValue) console.log(`${key}: ${oldValue} -> ${newValue}`)
	}
}

function build() {
	execFileSync("pnpm", ["build"], { cwd: root, stdio: "ignore" })
}

const { createConfig: baselineCreateConfig } = await import(configUrl)
const baseline = await collectValues(baselineCreateConfig)

const withOffValues = await collectValues(options => createConfigWithAppend(options))
async function createConfigWithAppend(options) {
	const configs = await baselineCreateConfig(options)
	return [...configs, { rules: { [rule]: "off" } }]
}

const backups = new Map()
let candidateCreateConfig = baselineCreateConfig
try {
	for (const file of sourceFiles(path.join(root, "src/configs"))) {
		const original = fs.readFileSync(file, "utf8")
		const modified = removeOffDeclarations(original)
		if (modified !== original) {
			backups.set(file, original)
			fs.writeFileSync(file, modified)
		}
	}
	if (backups.size) {
		build()
		const candidateUrl = `${configUrl}?candidate=${Date.now()}`
		const imported = await import(candidateUrl)
		candidateCreateConfig = imported.createConfig
	}
	const candidate = await collectValues(candidateCreateConfig)
	printDiff("REMOVE_EXISTING_OFF", baseline, candidate)
	printDiff("ADD_OFF", baseline, withOffValues)
} finally {
	for (const [file, original] of backups) fs.writeFileSync(file, original)
	if (backups.size) build()
}
