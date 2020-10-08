import {
	sOpenObject,
	sLiteral,
	sString,
	sOptionalProp,
	sProp,
} from "@hediet/semantic-json";
import * as React from "react";
import {
	createVisualizer,
	globalVisualizationFactory,
	createReactVisualization,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";
import { makeLazyLoadable } from "../../utils/LazyLoadable";

export const MonacoEditorLazyLoadable = makeLazyLoadable(
	async () => (await import("./MonacoEditor")).MonacoEditor
);

export const monacoTextVisualizer = createVisualizer({
	id: "monaco-text",
	name: "Text",
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sProp(sString(), { description: "The text to show" }),
		fileName: sOptionalProp(sString(), {
			description:
				"An optional filename that might be used for chosing a syntax highlighter",
		}),
	}).defineAs(visualizationNs("MonacoTextVisualizationData")),
	getVisualization: (data, self) =>
		createReactVisualization(
			self,
			{ priority: 500, preload: MonacoEditorLazyLoadable.preload },
			({ theme }) => (
				<MonacoEditorLazyLoadable
					text={data.text}
					fileName={data.fileName}
					theme={theme}
				/>
			)
		),
});

globalVisualizationFactory.addVisualizer(monacoTextVisualizer);
