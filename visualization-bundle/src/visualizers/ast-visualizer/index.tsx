import {
	Serializer,
	sLazy,
	sOpenObject,
	sArrayOf,
	sString,
	sOptionalProp,
	sUnion,
	sLiteral,
	sBoolean,
	sProp,
	sNumber,
} from "@hediet/semantic-json";
import { visualizationNs } from "../../consts";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { createTreeViewModelFromTreeNodeData } from "../tree-visualizer";
import { AstTree, NodeInfo } from "./AstVisualizer";
import React from "react";
import LineColumn from "line-column";
import * as monacoTypes from "monaco-editor";
import { getLoadedMonaco } from "@hediet/monaco-editor-react";

interface AstTreeNode {
	children: AstTreeNode[];
	items: Item[];
	segment?: string; // like "root", ".name" or "[0]"
	isMarked?: boolean;
	span: NodeInfo;
}

interface Item {
	text: string;
	emphasis?: "style1" | "style2" | "style3" | string;
}

export const sAstTreeNode: Serializer<AstTreeNode> = sLazy(() =>
	sOpenObject({
		children: sArrayOf(sAstTreeNode),
		items: sArrayOf(
			sOpenObject({
				text: sString(),
				emphasis: sOptionalProp(
					sUnion(
						[
							sLiteral("style1"),
							sLiteral("style2"),
							sLiteral("style3"),
							sString(),
						],
						{ inclusive: true }
					)
				),
			}).defineAs(visualizationNs("TreeNodeItem"))
		),
		segment: sOptionalProp(sString()),
		isMarked: sOptionalProp(sBoolean()),
		span: sOpenObject({
			start: sNumber(),
			length: sNumber(),
		}),
	}).defineAs(visualizationNs("TreeNode"))
);

export const sAstTree = sOpenObject({
	kind: sOpenObject({
		tree: sLiteral(true),
		text: sLiteral(true),
	}),
	root: sAstTreeNode,
	text: sString(),
	fileName: sOptionalProp(sString()),
});

export const astVisualizer = createVisualizer({
	id: "ast",
	name: "AST",
	serializer: sAstTree,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1500 }, theme => {
			const m = createTreeViewModelFromTreeNodeData(
				data.root,
				node => node.span
			);
			const l = LineColumn(data.text);
			function translatePosition(pos: number): monacoTypes.IPosition {
				let r = l.fromIndex(pos);
				if (!r) {
					r = l.fromIndex(data.text.length - 1);
					r.col++;
				}
				return {
					column: r.col,
					lineNumber: r.line,
				};
			}
			const nodeInfoToRange = (info: NodeInfo): monacoTypes.IRange => {
				const start = translatePosition(info.start);
				const end = translatePosition(info.start + info.length);
				const range = getLoadedMonaco().Range.fromPositions(start, end);
				return range;
			};
			function posToIndex(pos: monacoTypes.IPosition): number {
				const i = l.toIndex(pos.lineNumber, pos.column);
				if (i == -1) {
					return data.text.length;
				}
				return i;
			}

			return (
				<AstTree
					model={m}
					theme={theme}
					data={data}
					nodeInfoToRange={nodeInfoToRange}
					posToIndex={posToIndex}
				/>
			);
		}),
});

globalVisualizationFactory.addVisualizer(astVisualizer);
