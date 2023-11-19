import { observer } from "mobx-react";
import * as React from "react";
import { DataSet, Network, Options } from "vis-network/standalone";
import { EdgeGraphData, NodeGraphData } from "../sGraph";

@observer
export class VisJsGraphViewer extends React.Component<{
	nodes: NodeGraphData[];
	edges: EdgeGraphData[];
}> {
	private readonly divRef = React.createRef<HTMLDivElement>();
	private readonly nodes = new DataSet<{
		id: string;
		label?: string;
		color?: { border: string; background: string } | string;
		shape?: string;
	}>();
	private readonly edges = new DataSet<{
		id: string;
		from: string;
		to: string;
		label?: string;
		color?: string;
		dashes?: boolean | number[];
		shape?: boolean;
	}>();

	render() {
		return (
			<div
				className="component-VisJsGraphViewer"
				style={{ height: "100%" }}
				ref={this.divRef}
			/>
		);
	}

	synchronizeData() {
		const newNodes = new Set<string>();
		for (const n of this.props.nodes) {
			newNodes.add(n.id);
			this.nodes.update({
				id: n.id,
				label: n.label !== undefined ? n.label : n.id,
				color: { background: n.color, border: n.borderColor },
				shape: n.shape,
			});
		}
		this.nodes.forEach((item) => {
			if (!newNodes.has(item.id)) {
				this.nodes.remove(item);
			}
		});

		function getIdOfEdge(e: EdgeGraphData): string {
			if (e.id) {
				return e.id;
			}
			return e.from + "####" + e.to + "|" + e.label;
		}

		const newEdges = new Set<string>();
		for (const n of this.props.edges) {
			const id = getIdOfEdge(n);
			newEdges.add(id);
			this.edges.update({
				id: id,
				label: n.label !== undefined ? n.label : "",
				from: n.from,
				to: n.to,
				color: n.color,
				dashes: { dashed: true, dotted: [1, 4], solid: false }[
					n.style || "solid"
				],
			});
		}
		this.edges.forEach((item) => {
			if (!newEdges.has(item.id)) {
				this.edges.remove(item);
			}
		});
	}

	componentDidUpdate() {
		this.synchronizeData();
	}

	componentDidMount() {
		this.synchronizeData();

		const data = {
			nodes: this.nodes,
			edges: this.edges,
		};
		const options: Options = {
			edges: {
				arrows: {
					to: { enabled: true, scaleFactor: 1, type: "arrow" },
				},
			},
		};
		this.network = new Network(this.divRef.current!, data, options);
		this.divRef.current!.setAttribute("tabindex", "0");
		document.addEventListener("copy", this.onCopy);
	}

	private network: Network | undefined;
	private readonly onCopy = (e: ClipboardEvent) => {
		if (!this.network) {
			return;
		}
		if (
			!(
				document.activeElement &&
				document.activeElement.className === "vis-network"
			)
		) {
			return;
		}

		const n = this.network as any;

		const nodesText: string[] = [];

		let id = 10;
		const visJsIdToNodeId = new Map<string, number>();

		// export to draw.io
		for (const node of Object.values(n.body.nodes) as any) {
			const label = node.shape.options.label;
			if (label === undefined) {
				continue;
			}

			let style = "";
			if (node.shape.constructor.name === "Ellipse") {
				style += "ellipse;";
			} else {
				style += "rounded=1;";
			}

			const nodeId = id++;
			visJsIdToNodeId.set(node.id, nodeId);

			nodesText.push(
				`
<mxCell id="${nodeId}" value="${label}" style="${style}" vertex="1" parent="1">
	<mxGeometry x="${node.x}" y="${node.y}" width="${node.shape.width}" height="${node.shape.height}" as="geometry"/>
</mxCell>`
			);
		}

		for (const edge of Object.values(n.body.edges) as any) {
			const label = edge.options.label || "";
			const edgeId = id++;

			nodesText.push(
				`
<mxCell id="${edgeId}" value="${label}" edge="1" source="${visJsIdToNodeId.get(
					edge.from.id
				)}" target="${visJsIdToNodeId.get(edge.to.id)}" parent="1">
	<mxGeometry relative="1" as="geometry"/>
</mxCell>`
			);
		}

		const data = `
<mxGraphModel>
	<root>
		<mxCell id="0"/>
		<mxCell id="1" parent="0"/>

		${nodesText.join("\n")}
	</root>
</mxGraphModel>`;

		/*
		<mxCell id="2" value="xxx" edge="1" source="3" target="4" parent="1">
			<mxGeometry relative="1" as="geometry"/>
		</mxCell>
		*/

		e.clipboardData!.setData("text/plain", encodeURIComponent(data));
		e.preventDefault();
	};

	componentWillUnmount() {
		document.removeEventListener("copy", this.onCopy);
	}
}
