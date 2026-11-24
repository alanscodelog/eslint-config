export function matchesAnyGlob(filePath: string, globs: string[]): boolean {
	for (const glob of globs) {
		let pattern = ""
		const normalized = glob.replace(/\\/g, "/")

		for (let index = 0; index < normalized.length; index++) {
			const character = normalized[index]

			if (character === "*") {
				if (normalized[index + 1] === "*") {
					index++

					if (normalized[index + 1] === "/") {
						index++
						pattern += "(?:[^/]+/)*"
					} else {
						pattern += ".*"
					}
				} else {
					pattern += "[^/]*"
				}
			} else if (character === "?") {
				pattern += "[^/]"
			} else {
				pattern += character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
			}
		}

		if (new RegExp(`^${pattern}$`).test(filePath)) return true
	}

	return false
}
