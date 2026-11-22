import { allowDefaultProjectGlobs, createConfig } from "@alanscodelog/eslint-config"

export default createConfig({
	allowDefaultProject: allowDefaultProjectGlobs.filter(glob => glob !== "*.ts"),
	vue: true,
	type: "app"
})
