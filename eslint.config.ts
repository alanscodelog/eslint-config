import { createConfig } from "./src/config.js"

export default createConfig({
	allowDefaultProject: ["*.js", "*.mjs", "*.cjs", "eslint.config.*", "tsdown.config.*"],
})
