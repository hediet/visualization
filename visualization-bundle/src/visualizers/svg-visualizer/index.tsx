import * as React from "react";
import { sOpenObject, sLiteral, sString, sProp } from "@hediet/semantic-json";
import { SvgViewer } from "./SvgViewer";
import {
	createVisualizer,
	globalVisualizationFactory,
	createReactVisualization,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";

export const svgVisualizer = createVisualizer({
	id: "svg",
	name: "Svg",
	serializer: sOpenObject({
		kind: sOpenObject({
			svg: sLiteral(true),
		}),
		text: sProp(sString(), { description: "The svg content" }),
	}).defineAs(visualizationNs("SvgVisualizationData")),
	getVisualization: (data, self) =>
		createReactVisualization(self, { priority: 1500 }, () => (
			<SvgViewer svgContent={data.text} />
		)),
});

globalVisualizationFactory.addVisualizer(svgVisualizer);
