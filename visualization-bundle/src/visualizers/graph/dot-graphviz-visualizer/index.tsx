import * as React from "react";
import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import { getSvgFromDotCode, GraphvizDotViewer } from "./GraphvizDotVisualizer";
import {
	globalVisualizationFactory,
	createVisualizer,
	createReactVisualization,
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
	getVisualization: (data, self) => {
		const svgSource = getSvgFromDotCode(data.text);
		return createReactVisualization(
			self,
			{
				priority: 1500,
				preload: () => svgSource.load(),
			},
			() => <GraphvizDotViewer svgSource={svgSource} />
		);
	},
});

globalVisualizationFactory.addVisualizer(graphvizDotVisualizer);
