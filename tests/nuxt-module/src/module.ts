import { defineNuxtModule } from "@nuxt/kit"
import type { ModuleOptions } from "./types.js"

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
	meta: {
		name: "my-module",
		configKey: "myModule"
	},
	// Default configuration options of the Nuxt module
	defaults: {},
	setup(_options, _nuxt) {

	}
})
