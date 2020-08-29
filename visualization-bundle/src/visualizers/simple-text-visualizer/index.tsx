import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import * as React from "react";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";

export const simpleTextVisualizer = createVisualizer({
	// The id must be unique
	id: "simple-text",
	// The name can be some display text
	name: "Simple Text",
	// Here you can define the schema for the data that this visualizer can handle.
	// You must have a kind property of type object whose properties must be `true`.
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sString(),
	}).defineAs(
		// This name is important for schema and code generation of the interface types.
		// Make sure it is unique. It should end with "VisualizationData".
		visualizationNs("SimpleTextVisualizationData")
	),
	getVisualization: (
		/* The type of data is specified by the serializer above. */ data,
		self
	) =>
		// If you want to use react, this is the way to go.
		// Return your own implementation if you want to render directly to the DOM.
		new ReactVisualization(
			self,
			{
				// The priority is used for automatically selecting the best visualization
				// if multiple visualizations can handle the data.
				priority: 100,
			},
			() => (
				<pre
					className="visualizer-simple-text"
					style={{
						margin: 0,
						padding: 10,
						// Use css vars for theming.
						// See ./style.scss.
						color: "var(--visualizer-simple-text-color)",
					}}
				>
					{data.text}
				</pre>
			)
		),
});

// This registers the visualizer for automatic discovery.
// Make sure to import this file in "../index.ts" so that it gets loaded when
// someone imports "@hediet/visualization-bundle"!
globalVisualizationFactory.addVisualizer(simpleTextVisualizer);
