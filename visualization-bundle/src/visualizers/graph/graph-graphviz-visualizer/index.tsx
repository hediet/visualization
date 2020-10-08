import * as React from "react";
import { sGraph } from "../sGraph";
import {
	createVisualizer,
	globalVisualizationFactory,
	createReactVisualization,
} from "@hediet/visualization-core";
import { GraphvizDotViewer } from "../dot-graphviz-visualizer/GraphvizDotVisualizer";
import { getSvgFromGraphData } from "./getGraphVizData";

export const graphvizGraphVisualizer = createVisualizer({
	id: "graphviz-graph",
	name: "Graphviz",
	serializer: sGraph,
	getVisualization: (data, self) => {
		const svgSource = getSvgFromGraphData(data.nodes, data.edges);
		return createReactVisualization(
			self,
			{ priority: 1000, preload: () => svgSource.load() },
			() => <GraphvizDotViewer svgSource={svgSource} />
		);
	},
});

globalVisualizationFactory.addVisualizer(graphvizGraphVisualizer);
