import { BaseSerializer } from "@hediet/semantic-json";
import { Visualization, Visualizer, asVisualizerId } from "./Visualizer";

export interface CreateVisualizerOptions<TData> {
	/**
	 * A unique id for this visualizer.
	 */
	id: string;

	/**
	 * A human readable name of this visualizer.
	 * Should be in English language.
	 */
	name: string;

	serializer: BaseSerializer<TData>;
	getVisualization: (data: TData, self: Visualizer) => Visualization;
}

export function createVisualizer<TData>(
	options: CreateVisualizerOptions<TData>
): Visualizer {
	const result: Visualizer = {
		id: asVisualizerId(options.id),
		name: options.name,
		serializer: options.serializer.refine({
			fromIntermediate: (data) => options.getVisualization(data, result),
			canSerialize: (val): val is Visualization => false,
			toIntermediate: () => {
				throw new Error("not supported");
			},
		}),
	};
	return result;
}
