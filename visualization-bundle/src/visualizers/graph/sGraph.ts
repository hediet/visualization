import {
	sOpenObject,
	sLiteral,
	sArrayOf,
	sString,
	sOptionalProp,
	sUnion,
	sBoolean,
} from "@hediet/semantic-json";
import { visualizationNs } from "../../consts";

export type NodeGraphData = typeof sGraphNode.T;
export type EdgeGraphData = typeof sGraphEdge.T;

export const sGraphNode = sOpenObject({
	id: sString(),
	label: sOptionalProp(sString(), {}),
	color: sOptionalProp(sString(), {}),
	shape: sOptionalProp(sUnion([sLiteral("ellipse"), sLiteral("box")]), {}),
}).defineAs(visualizationNs("GraphNode"));

export const sGraphEdge = sOpenObject({
	from: sString(),
	to: sString(),
	label: sOptionalProp(sString(), {}),
	id: sOptionalProp(sString(), {}),
	color: sOptionalProp(sString(), {}),
	style: sOptionalProp(
		sUnion([sLiteral("solid"), sLiteral("dashed"), sLiteral("dotted")]),
		{}
	),
}).defineAs(visualizationNs("GraphEdge"));

export const sGraph = sOpenObject({
	kind: sOpenObject({ graph: sLiteral(true) }),
	nodes: sArrayOf(sGraphNode),
	edges: sArrayOf(sGraphEdge),
}).defineAs(visualizationNs("GraphVisualizationData"));
