import {
	JsonSchemaGenerator,
	TypeScriptTypeGenerator,
} from "@hediet/semantic-json";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { globalVisualizationFactory } from "@hediet/visualization-core";
import "../src/visualizations";

const tsGen = new TypeScriptTypeGenerator();
const tp = tsGen.getType(globalVisualizationFactory.getSerializer());

const tsSrc = `export type KnownVisualizationData = ${tp};\n\n\n${[
	...tsGen.definitions.values(),
]
	.map(v => v.getDefinitionSource({ exported: true }) + `\n\n`)
	.join("")}`;

const targetDir = join(__dirname, "../dist/docs");

mkdirSync(targetDir, { recursive: true });

writeFileSync(join(targetDir, "visualization-data.ts"), tsSrc, {
	encoding: "utf-8",
});

const schema = new JsonSchemaGenerator().getJsonSchemaWithDefinitions(
	globalVisualizationFactory.getSerializer()
);
const jsonSchema = JSON.stringify(schema, undefined, 4);

writeFileSync(join(targetDir, "visualization-data-schema.json"), jsonSchema, {
	encoding: "utf-8",
});
