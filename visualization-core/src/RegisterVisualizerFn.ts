import * as semanticJson from "@hediet/semantic-json";
import { createCanvas2DVisualization } from "./CanvasVisualization";
import { CreateVisualizerOptions } from "./createVisualizer";
import { Visualization, Visualizer } from "./Visualizer";

export type RegisterVisualizerFn = (
	register: <TData>(
		visualizationOptions: CreateVisualizerOptions<TData>
	) => void,
	lib: Lib
) => void;

interface Lib {
	semanticJson: typeof semanticJson;

	createCanvas2DVisualization: (
		visualizer: Visualizer,
		options: { priority: number },
		render: (context: CanvasRenderingContext2D) => void
	) => Visualization;
}

export const libImplementation: Lib = {
	semanticJson,
	createCanvas2DVisualization,
};
