import { sAny, sOpenObject } from "@hediet/semantic-json";
import * as React from "react";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { MonacoEditor } from "../monaco-text-visualizer/MonacoEditor";
import { visualizationNs } from "../../consts";

export const sourceVisualizer = createVisualizer({
	id: "source",
	name: "JSON Source",
	serializer: sOpenObject({
		kind: sOpenObject({}),
	}).defineAs(visualizationNs("SourceVisualizationData")),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: -100 }, theme => (
			<MonacoEditor
				text={JSON.stringify(data, undefined, 4)}
				languageId={"json"}
				theme={theme}
			/>
		)),
});

globalVisualizationFactory.addHiddenVisualizer(sourceVisualizer);
