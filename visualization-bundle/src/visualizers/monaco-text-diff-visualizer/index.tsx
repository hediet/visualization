import {
	sOpenObject,
	sLiteral,
	sString,
	sOptionalProp,
	sProp,
} from "@hediet/semantic-json";
import * as React from "react";
import {
	createReactVisualization,
	createVisualizer,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";
import { makeLazyLoadable } from "../../utils/LazyLoadable";

const MonacoDiffEditorLazyLoadable = makeLazyLoadable(
	async () => (await import("./MonacoEditor")).MonacoDiffEditor
);

export const monacoTextDiffVisualizer = createVisualizer({
	id: "monaco-text-diff",
	name: "Text Diff",
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sProp(sString(), { description: "The text to show" }),
		otherText: sProp(sString(), {
			description: "The text to compare against",
		}),
		fileName: sOptionalProp(sString(), {
			description:
				"An optional filename that might be used for chosing a syntax highlighter",
		}),
	}).defineAs(visualizationNs("MonacoTextDiffVisualizationData")),
	getVisualization: (data, self) =>
		createReactVisualization(
			self,
			{ priority: 900, preload: MonacoDiffEditorLazyLoadable.preload },
			({ theme }) => (
				<MonacoDiffEditorLazyLoadable
					originalText={data.otherText}
					modifiedText={data.text}
					fileName={data.fileName}
					theme={theme}
				/>
			)
		),
});

globalVisualizationFactory.addVisualizer(monacoTextDiffVisualizer);
