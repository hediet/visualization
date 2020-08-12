import Measure, { ContentRect } from "react-measure";
import { observer } from "mobx-react";
import * as React from "react";
import { observable, action } from "mobx";
import { Tool, ReactSVGPanZoom, Value } from "react-svg-pan-zoom";

function widthOrDefault(r: ContentRect): number {
	if (r.bounds && r.bounds.width) {
		return r.bounds.width;
	}
	return 1;
}

function heightOrDefault(r: ContentRect): number {
	if (r.bounds && r.bounds.height) {
		return r.bounds.height;
	}
	return 1;
}

@observer
export class SvgViewer extends React.Component<{
	svgContent: string;
	svgRef?: (element: SVGSVGElement | null) => void;
}> {
	@observable tool: Tool = "pan";

	@action.bound
	private setTool(tool: Tool): void {
		this.tool = tool;
	}

	private readonly svgPanZoomRef = React.createRef<ReactSVGPanZoom>();

	componentDidMount() {
		const element = this.svgPanZoomRef.current;
		if (this.props.svgRef) {
			if (!element) {
				this.props.svgRef(null);
				return;
			}

			const svg = (element as any).ViewerDOM as SVGSVGElement;
			this.props.svgRef(svg);
		}
	}

	@observable value: Value | {} = {};

	render() {
		let { svgContent } = this.props;
		let width: number = 0;
		let height: number = 0;
		svgContent = svgContent.replace(
			/viewBox="[0-9\.]+ [0-9\.]+ ([0-9\.]+) ([0-9\.]+)"/,
			(r, w, h) => {
				width = parseFloat(w);
				height = parseFloat(h);
				return "";
			}
		);
		const tool = this.tool;
		const val = this.value;

		return (
			<Measure
				bounds
				onResize={() => {
					if (this.svgPanZoomRef.current) {
						(this.svgPanZoomRef.current.fitToViewer as any)(
							"center",
							"center"
						);
					}
				}}
			>
				{({ measureRef, contentRect }) => (
					<div
						ref={measureRef}
						className="svgViewer"
						style={{ width: "100%", height: "100%" }}
					>
						<ReactSVGPanZoom
							width={widthOrDefault(contentRect)}
							height={heightOrDefault(contentRect)}
							tool={tool}
							value={val as any}
							onChangeValue={v => (this.value = v)}
							onChangeTool={this.setTool}
							ref={this.svgPanZoomRef}
							toolbarProps={{
								SVGAlignX: "center",
								SVGAlignY: "center",
							}}
							miniatureProps={{
								position: "none",
								height: 0,
								width: 0,
								background: "black",
							}}
						>
							<svg width={width} height={height}>
								<g
									dangerouslySetInnerHTML={{
										__html: svgContent,
									}}
								/>
							</svg>
						</ReactSVGPanZoom>
					</div>
				)}
			</Measure>
		);
	}
}
