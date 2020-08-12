import { observer } from "mobx-react";
import * as React from "react";
import { GraphvizDotViewer } from "../dot-graphviz-visualizer/GraphvizDotVisualizer";

@observer
export class GraphvizGraphViewer extends React.Component<{
	nodes: { id: string; label?: string }[];
	edges: { from: string; to: string; label?: string }[];
}> {
	render() {
		const { nodes, edges } = this.props;
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
							`"${e.from}" -> "${
								e.to
							}" [ label = ${JSON.stringify(
								e.label !== undefined ? e.label : ""
							)} ];`
					)
					.join("\n")}
            }
        `;
		return <GraphvizDotViewer dotCode={dotContent} />;
	}
}
