import { createConfig } from "@alanscodelog/eslint-config"

export default createConfig({
	allowDefaultProject: ["*.js", "*.cjs", "*.mjs"],
	vue: true,
	type: "app"
})
