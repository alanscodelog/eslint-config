import path from "node:path"
import { matchesAnyGlob } from "../shared/matchesAnyGlob.js"

export function isExemptFile(filename: string, cwd: string, ignore: string[]): boolean {
	const filePath = path.relative(cwd, path.resolve(cwd, filename)).replace(/\\/g, "/")

	return filePath.endsWith(".d.ts") || matchesAnyGlob(filePath, ignore)
}
