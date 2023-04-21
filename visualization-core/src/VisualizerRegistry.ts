import { Visualizer, Visualization, VisualizationId } from "./Visualizer";
import { VisualizationData } from "./VisualizationData";
import { JSONValue, sUnionMany } from "@hediet/semantic-json";
import { ObservableMap } from "mobx";

export class VisualizationFactory {
	private readonly visualizers = new ObservableMap<string, Visualizer>();
	private readonly hiddenVisualizers = new ObservableMap<
		string,
		Visualizer
	>();

	public getSerializer() {
		return this._getSerializer(this.visualizers);
	}

	private _getSerializer(map: ObservableMap<string, Visualizer>) {
		return sUnionMany(
			[...map.values()].map((v) => v.serializer.asSerializer()),
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

		allVisualizations.sort((a, b) => b.priority - a.priority);

		let bestVisualization: Visualization | undefined = allVisualizations[0];
		if (bestVisualization && bestVisualization.priority < 0) {
			bestVisualization = undefined;
		}
		if (preferredVisualization) {
			const preferred = allVisualizations.find(
				(vis) => vis.id === preferredVisualization
			);
			if (preferred) {
				bestVisualization = preferred;
			}
		}

		return {
			bestVisualization,
			allVisualizations,
			visualizationDataErrors: [],
		};
	}
}

export interface Visualizations {
	bestVisualization: Visualization | undefined;
	allVisualizations: Visualization[];
	visualizationDataErrors: VisualizationDataError[];
}

export interface VisualizationDataError {
	visualizer: Visualizer;
	message: string;
}

export const globalVisualizationFactory = new VisualizationFactory();
