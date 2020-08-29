import {
	sOpenObject,
	sLiteral,
	sString,
	sOptionalProp,
	sProp,
} from "@hediet/semantic-json";
import * as React from "react";
import {
	getLanguageId,
	MonacoEditor as MonacoDiffEditor,
} from "./MonacoEditor";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";

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
		new ReactVisualization(self, { priority: 900 }, theme => {
			let id = "text";
			if (data.fileName) {
				id = getLanguageId(data.fileName);
			}
			return (
				<MonacoDiffEditor
					originalText={data.otherText}
					modifiedText={data.text}
					languageId={id}
					theme={theme}
				/>
			);
		}),
});

globalVisualizationFactory.addVisualizer(monacoTextDiffVisualizer);
