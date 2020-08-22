import * as React from "react";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/themes/all-themes.css";
import { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";

export class PerspectiveDataViewer extends React.Component<
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
