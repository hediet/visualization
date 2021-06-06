import {
	sOpenObject,
	sLiteral,
	sString,
	sOptionalProp,
	sProp,
	sArrayOf,
	sNumber,
	sUnion,
} from "@hediet/semantic-json";
import * as React from "react";
import {
	createVisualizer,
	globalVisualizationFactory,
	createReactVisualization,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";
import { makeLazyLoadable } from "../../utils/LazyLoadable";
import { Decoration } from "./MonacoEditor";

export const MonacoEditorLazyLoadable = makeLazyLoadable(
	async () => (await import("./MonacoEditor")).MonacoEditor
);

export const LineColumnPosition = sOpenObject({
	line: sProp(sNumber(), { description: "The 0-based line number" }),
	column: sProp(sNumber(), { description: "The 0-based column number" }),
}).defineAs(visualizationNs("LineColumnPosition"));

export const LineColumnRange = sOpenObject({
	start: sProp(LineColumnPosition, { description: "The start position" }),
	end: sProp(LineColumnPosition, { description: "The end position" }),
}).defineAs(visualizationNs("LineColumnRange"));

export const OffsetPosition = sNumber().defineAs(
	visualizationNs("OffsetPosition")
);

export const OffsetRange = sOpenObject({
	start: sProp(OffsetPosition, { description: "The start position" }),
	end: sProp(OffsetPosition, { description: "The end position" }),
}).defineAs(visualizationNs("OffsetRange"));

export const monacoTextVisualizer = createVisualizer({
	id: "monaco-text",
	name: "Text",
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sProp(sString(), { description: "The text to show" }),
		decorations: sOptionalProp(
			sArrayOf(
				sOpenObject({
					range: sUnion([LineColumnRange]),
					label: sOptionalProp(sString()),
				})
			)
		),
		fileName: sOptionalProp(sString(), {
			description:
				"An optional filename that might be used for chosing a syntax highlighter",
		}),
	}).defineAs(visualizationNs("MonacoTextVisualizationData")),
	getVisualization: (data, self) =>
		createReactVisualization(
			self,
			{ priority: 500, preload: MonacoEditorLazyLoadable.preload },
			function({ theme }) {
				const decorations = data.decorations
					? data.decorations.map<Decoration>(d => ({
							label: d.label,
							range: {
								startLineNumber: d.range.start.line + 1,
								startColumn: d.range.start.column + 1,
								endLineNumber: d.range.end.line + 1,
								endColumn: d.range.end.column + 1,
							},
					  }))
					: [];

				return (
					<MonacoEditorLazyLoadable
						text={data.text}
						fileName={data.fileName}
						theme={theme}
						decorations={decorations}
					/>
				);
			}
		),
});

globalVisualizationFactory.addVisualizer(monacoTextVisualizer);
