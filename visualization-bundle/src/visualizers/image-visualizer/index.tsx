import { sOpenObject, sLiteral, sString } from "@hediet/semantic-json";
import React from "react";
import {
	createVisualizer,
	ReactVisualization,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { SvgViewer } from "../svg-visualizer/SvgViewer";
import { Observer, observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun } from "mobx";

export const imageVisualizer = createVisualizer({
	id: "image",
	name: "Image",
	serializer: sOpenObject({
		kind: sOpenObject({
			imagePng: sLiteral(true),
		}),
		base64Data: sString(),
	}),
	getVisualization: (data, self) =>
		new ReactVisualization(self, { priority: 1000 }, () => {
			return <ImageViewer base64Data={data.base64Data} />;
		}),
});

@observer
class ImageViewer extends React.Component<{ base64Data: string }> {
	@observable private svg: string | undefined = undefined;

	@disposeOnUnmount
	private readonly updateSvg = autorun(async () => {
		const src = `data:image/png;base64,${this.props.base64Data}`;

		const { width, height } = await new Promise<{
			width: number;
			height: number;
		}>(res => {
			const img = new Image();
			img.onload = function() {
				res({ width: img.width, height: img.height });
			};
			img.src = src;
		});

		this.svg = `
			<svg viewBox="0 0 ${width} ${height}">
				<defs>
					<pattern id="Pattern" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
						<rect x="0" y="0" width="7" height="7" style="fill: lightgray; stroke-width: 0" />
						<rect x="7" y="7" width="7" height="7" style="fill: lightgray; stroke-width: 0" />
					</pattern>
				</defs>

				<rect fill="url(#Pattern)" style="stroke-width: 0" width="${width}" height="${height}"/>

				<image style="image-rendering: pixelated" xlink:href="${src}" />
			</svg>`;
	});

	render() {
		if (!this.svg) {
			return null;
		}

		return <SvgViewer svgContent={this.svg} />;
	}
}

globalVisualizationFactory.addVisualizer(imageVisualizer);
