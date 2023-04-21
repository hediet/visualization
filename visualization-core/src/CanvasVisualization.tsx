import * as React from "react";
import { createReactVisualization } from "./ReactVisualization";
import { Visualization, Visualizer } from "./Visualizer";
import { Disposable } from "@hediet/std/disposable";

export function createCanvas2DVisualization(
	sourceVisualizer: Visualizer,
	options: { priority: number },
	render: (context: CanvasRenderingContext2D) => Disposable | void
): Visualization {
	return createReactVisualization(
		sourceVisualizer,
		{ priority: options.priority },
		() => (
			<canvas
				ref={(canvas) => {
					if (canvas) {
						const ctx = canvas.getContext("2d")!;
						ctx.clearRect(0, 0, canvas.width, canvas.height);

						// We don't want to use try/catch to swallow the error, so we use setTimeout to protect the caller
						setTimeout(() => {
							render(ctx);
						}, 0);
					}
				}}
			/>
		)
	);
}
