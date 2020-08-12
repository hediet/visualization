import {
	sOpenObject,
	sLiteral,
	sString,
	sOptionalProp,
} from "@hediet/semantic-json";
import React from "react";
import { getLanguageId, MonacoEditor } from "./MonacoEditor";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";

export const monacoTextVisualizer = createVisualizer({
	id: "monaco-text",
	name: "Text",
	serializer: sOpenObject({
		kind: sOpenObject({
			text: sLiteral(true),
		}),
		text: sString(),
		fileName: sOptionalProp(sString(), {
			description:
				"An optional filename that might be used for chosing a syntax highlighter",
		}),
	}),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 500 }, theme => {
			let id = "text";
			if (data.fileName) {
				id = getLanguageId(data.fileName);
			}
			return (
				<MonacoEditor text={data.text} languageId={id} theme={theme} />
			);
		}),
});

globalVisualizationFactory.addVisualizer(monacoTextVisualizer);
