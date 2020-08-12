import React from "react";
import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import { SvgViewer } from "./SvgViewer";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";

export const svgVisualizer = createVisualizer({
	id: "svg",
	name: "Svg",
	serializer: sOpenObject({
		kind: sOpenObject({
			svg: sLiteral(true),
		}),
		text: sString(),
	}),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1500 }, () => (
			<SvgViewer svgContent={data.text} />
		)),
});

globalVisualizationFactory.addVisualizer(svgVisualizer);
