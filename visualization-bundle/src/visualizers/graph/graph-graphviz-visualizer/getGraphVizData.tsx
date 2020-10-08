import { Loadable } from "../../../utils/Loadable";
import { getSvgFromDotCode } from "../dot-graphviz-visualizer/GraphvizDotVisualizer";

export function getSvgFromGraphData(
	nodes: { id: string; label?: string }[],
	edges: {
		from: string;
		to: string;
		label?: string;
		style?: string;
	}[]
): Loadable<string> {
	const dotContent = `
		digraph MyGraph {
			${nodes
				.map(
					n =>
						`"${n.id}" [ label = ${JSON.stringify(
							n.label !== undefined ? n.label : n.id
						)} ];`
				)
				.join("\n ")}
			${edges
				.map(
					e =>
						`"${e.from}" -> "${e.to}" [ label = ${JSON.stringify(
							e.label !== undefined ? e.label : ""
						)} style = ${JSON.stringify(e.style || "")} ];`
				)
				.join("\n")}
		}
	`;
	return getSvgFromDotCode(dotContent);
}
