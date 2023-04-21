import {
	sArrayOf,
	sLiteral,
	sNull,
	sNumber,
	sOpenObject,
	sOptionalProp,
	sProp,
	sString,
	sUnion,
} from "@hediet/semantic-json";
import { Deferred } from "@hediet/std/synchronization";
import {
	createLazyReactVisualization,
	createVisualizer,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import * as React from "react";
import { visualizationNs } from "../../consts";
import { makeLazyLoadable } from "../../utils/LazyLoadable";

const PlotlyViewerLazyLoadable = makeLazyLoadable(
	async () => (await import("./PlotlyViewer")).PlotlyViewer
);

const sDatum = sUnion([sString(), sNumber(), sNull()]);
const sDatumArr = sUnion([sArrayOf(sDatum), sArrayOf(sArrayOf(sDatum))]);
//const x: Plotly.Data;
export const plotlyVisualizer = createVisualizer({
	id: "plotly",
	name: "plotly",
	serializer: sOpenObject({
		kind: sOpenObject({
			plotly: sLiteral(true),
		}),
		data: sProp(
			sArrayOf(
				sOpenObject({
					text: sOptionalProp(
						sUnion([sString(), sArrayOf(sString())])
					),
					xaxis: sOptionalProp(sString()),
					yaxis: sOptionalProp(sString()),
					x: sOptionalProp(sDatumArr),
					y: sOptionalProp(sDatumArr),
					z: sOptionalProp(sDatumArr),
					cells: sOptionalProp(
						sOpenObject({
							values: sArrayOf(sDatumArr),
						})
					),
					header: sOptionalProp(
						sOpenObject({
							values: sDatumArr,
						})
					),
					domain: sOptionalProp(
						sOpenObject({
							x: sArrayOf(sNumber()),
							y: sArrayOf(sNumber()),
						})
					),
					type: sOptionalProp(
						sUnion([
							sLiteral("bar"),
							sLiteral("box"),
							sLiteral("candlestick"),
							sLiteral("choropleth"),
							sLiteral("contour"),
							sLiteral("heatmap"),
							sLiteral("histogram"),
							sLiteral("indicator"),
							sLiteral("mesh3d"),
							sLiteral("ohlc"),
							sLiteral("parcoords"),
							sLiteral("pie"),
							sLiteral("pointcloud"),
							sLiteral("scatter"),
							sLiteral("scatter3d"),
							sLiteral("scattergeo"),
							sLiteral("scattergl"),
							sLiteral("scatterpolar"),
							sLiteral("scatterternary"),
							sLiteral("sunburst"),
							sLiteral("surface"),
							sLiteral("treemap"),
							sLiteral("waterfall"),
							sLiteral("funnel"),
							sLiteral("funnelarea"),
							sLiteral("scattermapbox"),
							sLiteral("table"),
						])
					),
					mode: sOptionalProp(
						sUnion([
							sLiteral("lines"),
							sLiteral("markers"),
							sLiteral("text"),
							sLiteral("lines+markers"),
							sLiteral("text+markers"),
							sLiteral("text+lines"),
							sLiteral("text+lines+markers"),
							sLiteral("none"),
							sLiteral("gauge"),
							sLiteral("number"),
							sLiteral("delta"),
							sLiteral("number+delta"),
							sLiteral("gauge+number"),
							sLiteral("gauge+number+delta"),
							sLiteral("gauge+delta"),
						])
					),
				})
			),
			{
				description:
					"Expecting Plotly.Data[] (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/795ce172038dbafcb9cba030d637d733a7eea19c/types/plotly.js/index.d.ts#L1036)",
			}
		),
		layout: sOptionalProp(
			sOpenObject({
				title: sOptionalProp(sString()),
			}),
			{
				description:
					"Expecting Partial<Plotly.Layout> (https://github.com/DefinitelyTyped/DefinitelyTyped/blob/795ce172038dbafcb9cba030d637d733a7eea19c/types/plotly.js/index.d.ts#L329)",
			}
		),
	}).defineAs(visualizationNs("PlotlyVisualizationData")),
	getVisualization: (data, self) =>
		createLazyReactVisualization(
			self,
			{
				priority: 1000,
				preload: PlotlyViewerLazyLoadable.preload,
			},
			({ theme }) => {
				const b = new Deferred();
				return {
					node: (
						<PlotlyViewerLazyLoadable
							data={data.data}
							layout={data.layout}
							theme={theme}
							onReady={() => b.resolve}
						/>
					),
					ready: b.promise,
				};
			}
		),
});

globalVisualizationFactory.addVisualizer(plotlyVisualizer);
