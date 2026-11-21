[![Release][release-src]][release-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm version (beta)][npm-version-beta-src]][npm-version-beta-href]
[![License][license-src]][license-href]

My preferred flat eslint config. With auto-detection for Nuxt and oxlint, and configurable vue support.

# Install

```bash
npm add -D @alanscodelog/eslint-config eslint
```

## Manual Config Setup

Simple:
```js
// eslint.config.js
import { createConfig } from "@alanscodelog/eslint-config"
export default await createConfig()
```

Advanced:
```js
import { allowDefaultProjectGlobs, createConfig } from "@alanscodelog/eslint-config"
export default await createConfig(
	{
		// lib or app, defaults to lib
		type: "app",
		// auto-set when nuxt.config.ts/js exists at the root
		isNuxt: true,
		// auto-set when src/module.ts exists 
		// (and nuxt.config.ts does **not** exist at the root)
		isNuxtModule: true,
		// auto-set when .oxlintrc.json exists
		//	a string loads another config path, false force disables
		useOxlint: true,
		// auto-set if isNuxt or isNuxtModule, otherwise set manually
		vue: true,
		// files allowed by the typescript project service
		allowDefaultProject: [...allowDefaultProjectGlobs],
		// merged with defuArrayFn
		globs: {
			ts: defaults => defaults.filter(glob => !glob.includes(".tsx")),
			js: ["**/*.custom.js"],
			test: ["**/spec/**"]
		},
		// (NuxtESLintConfigOptions["dirs"])
		nuxtDirs: {
			pages: ["pages"],
			layouts: ["layouts"],
			components: ["components"]
		}
	},
	pipeline => {
		pipeline.overrideRules({
			// override rules here
		})
	}
)
```
## package.json

Add linting script to `package.json`:
```jsonc
{
	"scripts": {
		// double quotes escaped to avoid shell expanding globs which causes problems
		// *.{cjs,js,ts} so configs at root will be linted
		// common dir configurations:
		// - lib: src,tests,scripts
		// - Nuxt app: .
		// - Nuxt module: src,playground,test,tests,scripts
		"lint:eslint": "eslint \"{src,tests,<insert other needed dirs>}/**/*.{cjs,js,ts,vue}\" \"*.{cjs,js,ts}\" --max-warnings=0 --report-unused-disable-directives",
	}
}
```
<!-- Badges -->
[release-src]: https://github.com/alanscodelog/eslint-config/actions/workflows/release.yml/badge.svg
[release-href]: https://github.com/alanscodelog/eslint-config/actions/workflows/release.yml
[npm-version-src]: https://img.shields.io/npm/v/@alanscodelog/eslint-config/latest
[npm-version-href]: https://www.npmjs.com/package/@alanscodelog/eslint-config/v/latest
[npm-version-beta-src]: https://img.shields.io/npm/v/@alanscodelog/eslint-config/beta
[npm-version-beta-href]: https://www.npmjs.com/package/@alanscodelog/eslint-config/v/beta
[license-src]: https://img.shields.io/npm/l/@alanscodelog/eslint-config.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@alanscodelog/eslint-config

