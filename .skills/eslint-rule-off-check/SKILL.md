---
name: eslint-rule-off-check
description: Read when asked whether an ESLint rule needs an explicit off entry in @alanscodelog/eslint-config, or when asked to disable a rule there.
---

# ESLint rule off check

Use effective configs, not source text. An `off` entry is needed when removing it changes the resolved rule for at least one supported file type or config mode.

Build the package first when source changed:

```sh [eslint-config]
pnpm build
```

Run the sibling script from the shared config root. It restores preset values by temporarily removing exact `off` declarations from `src/configs`, then rebuilds and restores the source.

```sh [eslint-config]
node /home/alan/code/.skills/eslint-rule-off-check/check-rule-off.mjs no-console
```

Read the output:

- `REMOVE_EXISTING_OFF` lines mean existing `off` entries are load bearing. Keep them.
- Empty `REMOVE_EXISTING_OFF` means the matching `off` entries are removable.
- `ADD_OFF` lines mean the rule is active in those cases. Add `off` for those scopes.
- Empty `ADD_OFF` means the rule is already inactive in the tested cases. No `off` entry is needed.

Place the new `off` in the narrowest block that matches the reported cases. After editing, rerun the script. `REMOVE_EXISTING_OFF` should now report the scopes you intentionally disabled.

Audit each declaration individually. Remove one `off` declaration at a time when a rule has several declarations.

Run `pnpm test:projects` once when the Nuxt fixtures have no generated config.
