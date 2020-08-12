import { sAny } from "@hediet/semantic-json";
import React from "react";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { MonacoEditor } from "../monaco-text-visualizer/MonacoEditor";

export const sourceVisualizer = createVisualizer({
	id: "source",
	name: "JSON Source",
	serializer: sAny(),
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
