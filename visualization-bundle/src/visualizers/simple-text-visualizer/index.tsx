import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import * as React from "react";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";

export const simpleTextVisualizer = createVisualizer({
	id: "simple-text",
	name: "Simple Text",
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sString(),
	}).defineAs(visualizationNs("SimpleTextVisualizationData")),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 100 }, () => (
			<pre
				className="visualizer-simple-text"
				style={{
					margin: 0,
					padding: 10,
					color: "var(--visualizer-simple-text-color)",
				}}
			>
				{data.text}
			</pre>
		)),
});

globalVisualizationFactory.addVisualizer(simpleTextVisualizer);
