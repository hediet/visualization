import {
	TreeViewModel,
	TreeNodeViewModel,
	TreeView,
	TreeWithPathView,
} from "./Views";
import * as React from "react";
import {
	sOpenObject,
	sLiteral,
	sLazy,
	sString,
	sBoolean,
	sArrayOf,
	Serializer,
	sOptionalProp,
	sUnion,
} from "@hediet/semantic-json";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { visualizationNs } from "../../consts";

type TreeNode<T = {}> = {
	children: TreeNode<T>[];
	items: Item[];
	segment?: string; // like "root", ".name" or "[0]"
	isMarked?: boolean;
} & T;

export interface Item {
	text: string;
	emphasis?: "style1" | "style2" | "style3" | string;
}

const sTreeNode: Serializer<TreeNode> = sLazy(() =>
	sOpenObject({
		children: sArrayOf(sTreeNode),
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
	}).defineAs(visualizationNs("TreeNode"))
);

const sTree = sOpenObject({
	kind: sOpenObject({
		tree: sLiteral(true),
	}),
	root: sTreeNode,
});

export const treeVisualizer = createVisualizer({
	id: "tree",
	name: "Tree",
	serializer: sTree,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1200 }, () => {
			const m = createTreeViewModelFromTreeNodeData(
				data.root,
				() => undefined
			);
			return <TreeWithPathView model={m} />;
		}),
});

globalVisualizationFactory.addVisualizer(treeVisualizer);

export function createTreeViewModelFromTreeNodeData<TData, TNodeData>(
	root: TreeNode<TNodeData>,
	dataSelector: (node: TreeNode<TNodeData>) => TData
): TreeViewModel<TData> {
	const m = new TreeViewModel<TData>();
	m.root = recurse(root, m);
	return m;

	function recurse(
		node: TreeNode<TNodeData>,
		viewModel: TreeViewModel<TData>
	): TreeNodeViewModel<TData> {
		const children: TreeNodeViewModel<TData>[] = node.children.map(c =>
			recurse(c, viewModel)
		);

		let segment = node.segment;
		if (!segment && node.items.length > 0) {
			segment = node.items[0].text;
		} else {
			segment = "";
		}

		const model = new TreeNodeViewModel<TData>(
			viewModel,
			children,
			node.items,
			segment,
			dataSelector(node)
		);
		model.isMarked = !!node.isMarked;
		for (const c of children) {
			c.parent = model;
		}
		return model;
	}
}
