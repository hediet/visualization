import { VisualizationData, VisualizationId } from "@hediet/visualization-core";

export interface VisualizationDataSource</* must be json */ TState> {
	readonly editorView: React.ReactElement;

	setState(state: TState): void;
	setPreferredVisualizationId(id: VisualizationId | undefined): void;

	// is observable
	readonly state: TState;

	// is observable
	readonly data: VisualizationDataSourceState;
}

export type VisualizationDataSourceState =
	| {
			kind: "ok";
			value: VisualizationData;
			preferredVisualizationId: VisualizationId | undefined;
	  }
	| { kind: "error"; error: string };
