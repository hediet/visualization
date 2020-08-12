import React from "react";
import { sOpenObject, sLiteral, sArrayOf, sAny } from "@hediet/semantic-json";
import { toJS } from "mobx";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/themes/all-themes.css";
import { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";

export const sTable = sOpenObject({
	kind: sOpenObject({
		table: sLiteral(true),
	}),
	rows: sArrayOf(
		sAny() // object
	),
});

export const perspectiveTableVisualizer = createVisualizer({
	id: "perspective-table",
	name: "Perspective Table",
	serializer: sTable,
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1000 }, theme => (
			<PerspectiveDataViewer
				className={
					{
						light: "perspective-viewer-material",
						dark: "perspective-viewer-material-dark",
					}[theme.kind]
				}
				style={{
					width: "100%",
					height: "100%",
				}}
				data={toJS(data.rows)}
			/>
		)),
});

class PerspectiveDataViewer extends React.Component<
	{ data: object[] } & React.HTMLAttributes<HTMLDivElement>
> {
	private readonly nodeRef = React.createRef<HTMLPerspectiveViewerElement>();

	componentDidUpdate() {
		this.nodeRef.current!.load(this.props.data);
	}

	componentDidMount() {
		setTimeout(() => {
			// TODO: Why timeout?
			// It does not work without it.

			this.nodeRef.current!.load(this.props.data);
			this.nodeRef.current!.toggleConfig();
		});
	}

	render() {
		return (
			<perspective-viewer
				class={this.props.className}
				style={this.props.style}
				ref={this.nodeRef}
			/>
		);
	}
}

globalVisualizationFactory.addVisualizer(perspectiveTableVisualizer);
