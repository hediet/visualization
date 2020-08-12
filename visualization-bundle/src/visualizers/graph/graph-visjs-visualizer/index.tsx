import * as React from "react";
import { makeLazyLoadable } from "../../../utils/LazyLoadable";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { sGraph } from "../sGraph";

const VisJsGraphViewerLazyLoadable = makeLazyLoadable(
	async () => (await import("./VisJsGraphViewer")).VisJsGraphViewer
);

export const visJsGraphVisualizer = createVisualizer({
	id: "vis.js-graph",
	name: "vis.js",
	serializer: sGraph,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1500 }, () => (
			<VisJsGraphViewerLazyLoadable
				edges={data.edges}
				nodes={data.nodes}
			/>
		)),
});

globalVisualizationFactory.addVisualizer(visJsGraphVisualizer);
