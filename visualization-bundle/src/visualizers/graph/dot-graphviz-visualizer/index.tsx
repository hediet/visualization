import * as React from "react";
import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import { GraphvizDotViewer } from "./GraphvizDotVisualizer";
import {
	ReactVisualization,
	globalVisualizationFactory,
	createVisualizer,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../../consts";

export const graphvizDotVisualizer = createVisualizer({
	id: "graphviz-dot",
	name: "Graphviz (Dot Data)",
	serializer: sOpenObject({
		kind: sOpenObject({
			dotGraph: sLiteral(true),
		}),
		text: sString(),
	}).defineAs(visualizationNs("GraphvizDotVisualizationData")),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1500 }, () => (
			<GraphvizDotViewer dotCode={data.text} />
		)),
});

globalVisualizationFactory.addVisualizer(graphvizDotVisualizer);
