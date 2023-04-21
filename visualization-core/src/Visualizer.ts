import { BaseSerializer } from "@hediet/semantic-json";
import { Theme } from "./Theme";

export interface Visualizer {
	readonly id: VisualizerId;
	readonly name: string;

	/**
	 * Allows to deserialize JSON into an visualization.
	 * This object is also used to inspect the schema of that JSON.
	 */
	readonly serializer: BaseSerializer<Visualization>;
}

export interface VisualizerId extends String {
	__brand: "VisualizerId";
}

export function asVisualizerId(id: string): VisualizerId {
	return id as unknown as VisualizerId;
}

export interface Visualization<TRenderState = any> {
	readonly id: VisualizationId;
	readonly name: string;
	readonly priority: number;

	render(
		target: HTMLDivElement,
		options: VisualizationRenderOptions<TRenderState>
	): {
		renderState: TRenderState;
		/**
		 * Is resolved when the visualization stabilized and is ready to be shown.
		 * Note that the visualization can be shown before this promise resolves.
		 * This promise is useful for loading animations or integrations.
		 */
		ready: Promise<void>;
	};

	/**
	 * Preloads resources to speed up first rendering.
	 * The visualization does not need to be rendered for this.
	 */
	preload(): Promise<void>;
}

export interface VisualizationId extends String {
	__brand: "VisualizationId";
}

export function asVisualizationId(id: string): VisualizationId {
	return id as unknown as VisualizationId;
}

export interface VisualizationRenderOptions<TRenderState> {
	theme: Theme;
	previousRenderState: TRenderState | undefined;
}
