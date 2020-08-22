import { TypeScriptTypeGenerator } from "@hediet/semantic-json";
import { writeFileSync } from "fs";
import { globalVisualizationFactory } from "@hediet/visualization-core";
import "./src/index";

const t = new TypeScriptTypeGenerator();
const tp = t.getType(globalVisualizationFactory.getSerializer());

const src = `export type KnownVisualizationData = ${tp};\n\n\n${[
	...t.definitions.values(),
]
	.map(v => v.getDefinitionSource({ exported: true }) + `\n\n`)
	.join("")}`;

writeFileSync("./out.ts", src, { encoding: "utf-8" });
