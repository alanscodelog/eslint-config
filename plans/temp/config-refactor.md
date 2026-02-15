# Config Refactor Plan

## 1. Always append antfu (line 116-142)
Remove `if (!hasNuxtPipeline)` gate. antfu layers on top of standalone fine — our stylistic options override defaults.

## 2. Keep importX gate (line 148-154)
`standalone: true` includes import configs. Remove llm: comment only.

## 3. Always add jsdoc in alan/config (line 156-195)
jsdoc is NOT part of standalone (only with `tooling: true`). Remove conditional, always add. Remove llm: comment + block comment.

## 4. Always add alan/config-vue (line 197-214)
Same — jsdoc not in standalone. Remove `if (!hasNuxtPipeline)` gate. Remove llm: comment.

## 5. Always append alan/nuxt-module (line 311-332)
`@stylistic` IS registered by standalone. Remove `if/else` branch, always append. Remove llm: comment.

## 6. Remove empty blocks (line 335-344)
Empty `pipeline.override` and `pipeline.overrideRules({})` do nothing.
