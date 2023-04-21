import * as React from "react";
import { Visualization } from "./Visualizer";
import { Theme } from "./Theme";

export class VisualizationView extends React.Component<{
	visualization: Visualization;
	theme: Theme;
	onReady?: () => void;
}> {
	private readonly ref = React.createRef<HTMLDivElement>();
	private visualizationRenderState: unknown = undefined;

	componentDidMount() {
		this.renderVisualization();
	}

	componentDidUpdate() {
		this.renderVisualization();
	}

	renderVisualization() {
		const { visualization, theme } = this.props;
		const { renderState, ready } = visualization.render(this.ref.current!, {
			theme,
			previousRenderState: this.visualizationRenderState,
		});

		ready.then(() => {
			if (this.props.onReady) {
				return this.props.onReady();
			}
		});

		this.visualizationRenderState = renderState;
	}

	render() {
		return (
			<div
				className={`themeable theme-${this.props.theme.id} visualization`}
				style={{
					width: "100%",
					height: "100%",
					boxSizing: "border-box",
				}}
				ref={this.ref}
			/>
		);
	}
}
