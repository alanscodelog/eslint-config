[![Release][release-src]][release-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm version (beta)][npm-version-beta-src]][npm-version-beta-href]
[![License][license-src]][license-href]

My preferred base eslint configs along with an "install" script for quickly setting up the configs to extend from this one.

# Install

```bash
npm add -D @alanscodelog/eslint-config eslint
```

Run the install script (this will overwrite `eslint.config.js`).
```bash
./node_modules/@alanscodelog/eslint-config/install.sh
```

## Manual Config Setup

Simple:
```js
// eslint.config.js
import config from "@alanscodelog/eslint-config"
export default config
```

Advanced:
```js
import { allFileTypes, tsEslintConfig, vueConfig } from "@alanscodelog/eslint-config"
export default tsEslintConfig( // this is just a re-export of tsEslint.config
	// https://github.com/AlansCodeLog/eslint-config
	...vueConfig,
	{
		files: [`**/*.{${allFileTypes.join(",")}}`],
		// rules: ...
	}
	{
		ignores: [
			// ...	
		],
		languageOptions: {
			parserOptions: {
				projectService: {
					// defaultProject: "./tsconfig.eslint.json",
				}
			}
		},
	},
	// RULE LINKS
	// Eslint: https://eslint.org/docs/rules/
	// Typescript: https://typescript-eslint.io/rules/
	// Vue: https://eslint.vuejs.org/rules/
)
```
## package.json

Add linting script to `package.json`:
```jsonc
{
	"scripts": {
		// bin only if it has scripts, not for "dist" folder of cli
		// double quotes escaped to avoid shell expanding globs which causes problems
		// *.{cjs,js,ts} so configs at root will be linted
		"lint:eslint": "eslint \"{src,tests,bin}/**/*.{cjs,js,ts}\" \"*.{cjs,js,ts}\" --max-warnings=0 --report-unused-disable-directives",
	}
}
```
# Configs

## Notes

Each sets it's rules with the file types they can apply to. So the base example applies to all, and it gets more selective as we go all the way up to vue.

# Other

All rules are set to warn since I don't like the editor bleeding red. I pass `--max-warnings=0` to eslint when needed instead. Personally, a rule is either useful (in general, I might still ignore them) and code should pass all lints, or it's not and the rule should be disabled.

<!-- Badges -->
[release-src]: https://github.com/alanscodelog/eslint-config/actions/workflows/release.yml/badge.svg
[release-href]: https://github.com/alanscodelog/eslint-config/actions/workflows/release.yml
[npm-version-src]: https://img.shields.io/npm/v/@alanscodelog/eslint-config/latest
[npm-version-href]: https://www.npmjs.com/package/@alanscodelog/eslint-config/v/latest
[npm-version-beta-src]: https://img.shields.io/npm/v/@alanscodelog/eslint-config/beta
[npm-version-beta-href]: https://www.npmjs.com/package/@alanscodelog/eslint-config/v/beta
[license-src]: https://img.shields.io/npm/l/@alanscodelog/eslint-config.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@alanscodelog/eslint-config

