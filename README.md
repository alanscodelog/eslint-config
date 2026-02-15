[![Release][release-src]][release-href]
[![npm version][npm-version-src]][npm-version-href]
[![npm version (beta)][npm-version-beta-src]][npm-version-beta-href]
[![License][license-src]][license-href]

My preferred eslint config based partially on [Antfu's config](https://github.com/antfu/eslint-config/), with automatic nuxt and oxlint support.

Uses [`eslint-flat-config-utils`](https://github.com/antfu/eslint-flat-config-utils)'s `composer` to allow easy chaining.


```bash
pnpm add -D @alanscodelog/eslint-config eslint
```

## Installation

Add to `eslint.config.js`:

```js
import { createConfig } from "@alanscodelog/eslint-config"

export default await createConfig({ type: "lib" })
```

## Project Types

### Plain TypeScript / JavaScript

```js
export default await createConfig({ type: "lib" })
// or type: "app" for application projects
```

### Vue (non-Nuxt)

```js
export default await createConfig({ type: "lib", vue: true })
```

### Nuxt App

1. Add `@nuxt/eslint` to your Nuxt modules:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@nuxt/eslint"],
})
```

2. Run `nuxt prepare` to generate `.nuxt/eslint.config.mjs`.

3. Use in `eslint.config.js`:

```js
export default await createConfig({
	isNuxt: true, // optional, config will try to autodetect
	type: "app",
})
```

### Nuxt Module

```js
export default createConfig({
	isNuxtModule: true,
	type: "lib",
	nuxtEslintOptions: {
		features: {
			tooling: true,
		},
		dirs: {
			src: ["./playground"],
		},
	},
})
```

> **Note:** `@nuxt/eslint-config` uses spaces and single quotes for stylistic rules. If you pass `stylistic: true` in `nuxtEslintOptions.features`, it will conflict with our tab/double-quote style. Omit it to let our rules handle formatting.

`nuxtEslintOptions` works for both Nuxt apps and modules — it's passed through to the Nuxt ESLint pipeline (`withNuxt` for apps, `createConfigForNuxt` for modules).

## Oxlint

Automatically enabled if a `.oxlintrc.json` is found, or pass a custom path:

```js
export default await createConfig({ useOxlint: ".oxlintrc.json" })
```

## API

```ts
export async function createConfig(
  options: ConfigOptions,
  extendCb?: (pipeline: FlatConfigComposer) => void,
): Promise<FlatConfigComposer>
```

| Option | Default | Description |
|---|---|---|
| `type` | `"lib"` | `"lib"` or `"app"` |
| `isNuxt` | auto-detect | `true` if `nuxt.config.ts`/`.js` exists |
| `isNuxtModule` | `false` | Use for Nuxt module projects |
| `useOxlint` | auto-detect | `true` if `.oxlintrc.json` exists, or a path string |
| `vue` | `isNuxt \|\| false` | Enable Vue support |
| `allowDefaultProject` | `["*.js", "*.mjs", "*.cjs"]` | Files allowed to use default project when not in tsconfig |
|| `nuxtEslintOptions` | - | Options passed through to the Nuxt ESLint pipeline (see [docs](https://eslint.nuxt.com/packages/config)) |

Extend the pipeline:

```js
export default await createConfig(
  { type: "lib" },
  (pipeline) => {
    pipeline.overrideRules({
      "no-console": "off",
    })
  },
)
```

### IDE

If you, like me, do not like the error squiggles, especially for stylistic rules, in your IDE add the equivalent of this:

```json [.vscode/settings.json]
{
  "eslint.rules.customizations": [
    {
      "rule": "@stylistic/*",
      "fixable": true,
      "severity": "warn" // or "off"
    }
  ]
}
```

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

Each sets it's rules with the file types they can apply to. So the base example applies to all, and it gets more selective as we go all the way up to vue.

# Other

All rules are set to warn since I don't like the editor bleeding red. I pass `--max-warnings=0` to eslint when needed instead. Personally, a rule is either useful (in general, I might still ignore them) and code should pass all lints, or it's not and the rule should be disabled.
This renames some of the plugins in antfu back to their original names (ts => @typescript-eslint, etc).
This renames some of the plugins in antfu back to their original names (ts => @typescript-eslint, etc).
This renames some of the plugins in antfu back to their original names (`ts` => `@typescript-eslint`, etc).
