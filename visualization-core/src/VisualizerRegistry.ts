import { Visualizer, Visualization, VisualizationId } from "./Visualizer";
import { VisualizationData } from "./VisualizationData";
import { JSONValue, Serializer, sUnionMany } from "@hediet/semantic-json";
import { ObservableMap } from "mobx";

export class VisualizationFactory {
	private readonly visualizers = new ObservableMap<string, Visualizer>();
	private readonly hiddenVisualizers = new ObservableMap<
		string,
		Visualizer
	>();

	public getSerializer(): Serializer<[Visualization<any>, Visualizer][]> {
		return this._getSerializer(this.visualizers);
	}

	private _getSerializer(map: ObservableMap<string, Visualizer>): Serializer<[Visualization<any>, Visualizer][]> {
		return sUnionMany(
			[...map.values()].map((v) => v.serializer.asSerializer().refine<[Visualization, Visualizer]>({
				canSerialize: (v): v is [Visualization, Visualizer] => false,
				fromIntermediate: value => [value, v],
				toIntermediate: () => { throw new Error("not supported"); }
			})),
			{ processingStrategy: "all" }
		);
	}

	public addVisualizer(visualizer: Visualizer): void {
		this.visualizers.set(visualizer.id.toString(), visualizer);
	}

	public getRegisteredVisualizers(): Visualizer[] {
		return [...this.visualizers.values()];
	}

	public getRegisteredHiddenVisualizer(): Visualizer[] {
		return [...this.hiddenVisualizers.values()];
	}

	/**
	 * Hidden visualizers don't appear in `getSerializer` and should only be presented to the user if he explicitly selects it.
	 * `getVisualizations(...).bestVisualization` is only the result of a hidden visualizer if the user requests a hidden visualization id.
	 */
	public addHiddenVisualizer(visualizer: Visualizer): void {
		this.hiddenVisualizers.set(visualizer.id.toString(), visualizer);
	}

	public getVisualizations(
		data: VisualizationData,
		preferredVisualization: VisualizationId | undefined
	): Visualizations {
		const u = this.getSerializer();
		const result = u.deserialize(data as unknown as JSONValue);
		const allVisualizations = result.value || [];

		const u2 = this._getSerializer(this.hiddenVisualizers);
		const hiddenResult = u2.deserialize(data as unknown as JSONValue);
		allVisualizations.push(...(hiddenResult.value || []));

		allVisualizations.sort(([a], [b]) => b.priority - a.priority);

		let bestVisualization: [Visualization, Visualizer] | undefined = allVisualizations[0];
		if (bestVisualization && bestVisualization[0].priority < 0) {
			bestVisualization = undefined;
		}
		if (preferredVisualization) {
			const preferred = allVisualizations.find(
				([vis]) => vis.id === preferredVisualization
			);
			if (preferred) {
				bestVisualization = preferred;
			}
		}

		return {
			bestVisualization: bestVisualization ? bestVisualization[0] : undefined,
			bestVisualizationVisualizer: bestVisualization ? bestVisualization[1] : undefined,
			allVisualizations: allVisualizations.map(v => v[0]),
			visualizationDataErrors: [],
		};
	}
}

export interface Visualizations {
	bestVisualization: Visualization | undefined;
	bestVisualizationVisualizer: Visualizer | undefined;
	allVisualizations: Visualization[];
	visualizationDataErrors: VisualizationDataError[];
}

export interface VisualizationDataError {
	visualizer: Visualizer;
	message: string;
}

export const globalVisualizationFactory = new VisualizationFactory();
