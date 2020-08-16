import * as React from "react";
import {
	sOpenObject,
	sLiteral,
	sArrayOf,
	sOptionalProp,
	sAny,
	sProp,
} from "@hediet/semantic-json";
import { makeLazyLoadable } from "../../utils/LazyLoadable";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";

const PlotlyViewerLazyLoadable = makeLazyLoadable(
	async () => (await import("./PlotlyViewer")).PlotlyViewer
);

export const plotlyVisualizer = createVisualizer({
	id: "plotly",
	name: "plotly",
	serializer: sOpenObject({
		kind: sOpenObject({
			plotly: sLiteral(true),
		}),
		data: sProp(sArrayOf(sOpenObject()), {
			description:
				"Expecting Plotly.Data[] (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/795ce172038dbafcb9cba030d637d733a7eea19c/types/plotly.js/index.d.ts#L1036)",
		}),
		layout: sOptionalProp(sOpenObject(), {
			description:
				"Expecting Partial<Plotly.Layout> (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/795ce172038dbafcb9cba030d637d733a7eea19c/types/plotly.js/index.d.ts#L329)",
		}),
	}),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1000 }, theme => (
			<PlotlyViewerLazyLoadable
				data={data.data}
				layout={data.layout}
				theme={theme.kind}
			/>
		)),
});

globalVisualizationFactory.addVisualizer(plotlyVisualizer);
