import * as React from "react";
import { sOpenObject, sLiteral, sArrayOf, sProp } from "@hediet/semantic-json";
import { toJS } from "mobx";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { makeLazyLoadable } from "../../utils/LazyLoadable";
import { visualizationNs } from "../../consts";

export const sTable = sOpenObject({
	kind: sOpenObject({
		table: sLiteral(true),
	}),
	rows: sProp(sArrayOf(sOpenObject({})), {
		description:
			"An array of objects. The properties of the objects are used as columns.",
	}),
}).defineAs(visualizationNs("TableVisualizationData"));

const PerspectiveDataViewerLazyLoadable = makeLazyLoadable(
	async () => (await import("./PerspectiveDataViewer")).PerspectiveDataViewer
);

export const perspectiveTableVisualizer = createVisualizer({
	id: "perspective-table",
	name: "Perspective Table",
	serializer: sTable,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1000 }, theme => (
			<PerspectiveDataViewerLazyLoadable
				className={
					{
						light: "perspective-viewer-material",
						dark: "perspective-viewer-material-dark",
					}[theme.kind]
				}
				style={{
					width: "100%",
					height: "100%",
				}}
				data={toJS(data.rows)}
			/>
		)),
});

globalVisualizationFactory.addVisualizer(perspectiveTableVisualizer);
