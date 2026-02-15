import { defineConfig } from "tsdown"

export default defineConfig({
	entry: [
		"src/config.ts",
	],
	shims: true,
	format: ["esm"],
	exports: true,
})
