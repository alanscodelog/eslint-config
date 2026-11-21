import { createConfig } from "./src/config.js"

export default createConfig(
	{
		allowDefaultProject: ["*.js", "*.mjs", "*.cjs", "eslint.config.*", "tsdown.config.*"]
	},
	pipeline => {
		void pipeline.append(
			{
				files: ["src/configs/**/*.ts"],
				rules: {
					"@stylistic/array-bracket-spacing": "off"
				}
			},
			{
				rules: {
					"@typescript-eslint/explicit-function-return-type": "off"
				}
			}
		)
	}
)
