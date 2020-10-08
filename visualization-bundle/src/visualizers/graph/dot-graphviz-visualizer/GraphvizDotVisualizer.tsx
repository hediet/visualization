import { observer } from "mobx-react";
import * as React from "react";
import { SvgViewer } from "../../svg-visualizer/SvgViewer";
import { Loadable } from "../../../utils/Loadable";

class VisLoader {
	private result: any | undefined;

	async getViz(): Promise<any> {
		if (!this.result) {
			const Viz = await import("viz.js");
			const { Module, render } = await import("viz.js/full.render.js");

			const viz = new Viz.default({
				Module: () => Module({ TOTAL_MEMORY: 1 << 30 }),
				render,
			});

			this.result = viz;
		}
		return this.result;
	}
}

const vizLoader = new VisLoader();

export function getSvgFromDotCode(dotCode: string): Loadable<string> {
	return new Loadable(async () => {
		const viz = await vizLoader.getViz();
		return await viz.renderString(dotCode);
	});
}

@observer
export class GraphvizDotViewer extends React.Component<{
	svgSource: Loadable<string>;
	svgRef?: (element: SVGSVGElement | null) => void;
}> {
	render() {
		const { svgSource } = this.props;
		svgSource.load();
		if (!svgSource.result) {
			return <div>Loading...</div>;
		}
		return (
			<SvgViewer
				svgRef={this.props.svgRef}
				svgContent={svgSource.result}
			/>
		);
	}
}
