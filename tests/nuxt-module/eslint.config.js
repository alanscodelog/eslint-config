import { createConfig } from "@alanscodelog/eslint-config"

export default createConfig({
	isNuxtModule: true,
	type: "lib",
	nuxtEslintOptions: {
		dirs: {
			src: ["./playground"],
		},
	},
})
