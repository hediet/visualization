import * as React from "react";
import { GraphvizGraphViewer } from "./GraphvizGraphVisualizer";
import { sGraph } from "../sGraph";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";

export const graphvizGraphVisualizer = createVisualizer({
	id: "graphviz-graph",
	name: "Graphviz",
	serializer: sGraph,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1000 }, () => (
			<GraphvizGraphViewer edges={data.edges} nodes={data.nodes} />
		)),
});

globalVisualizationFactory.addVisualizer(graphvizGraphVisualizer);
