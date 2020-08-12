import { observable, action, computed } from "mobx";
import {
	Visualization,
	VisualizationId,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import { Disposable } from "@hediet/std/disposable";
import { QueryBinding } from "./QueryController";
import { VisualizationDataSource } from "./VisualizationDataSource";
import { JsonDataSource } from "./JsonDataSource";
import { encodeData, decodeData } from "./lzmaCompressor";
import { MonacoBridge } from "./MonacoBridge";
import { Ref } from "../common/utils";

export class Model {
	public readonly dispose = Disposable.fn();

	@observable
	public theme: "dark" | "light" = "light";

	private readonly monacoBridge = new MonacoBridge(this);

	@observable
	public visualization: VisualizationModel | undefined = undefined;

	private readonly q = new QueryBinding(
		"state",
		new Ref(
			() =>
				this.visualization
					? this.visualization.dataSource.state
					: undefined,
			newState => {
				if (newState !== undefined) {
					if (!this.visualization) {
						this.visualization = new VisualizationModel(
							new JsonDataSource(newState as any)
						);
					} else {
						this.visualization.dataSource.setState(newState);
					}
				} else {
					this.visualization = undefined;
				}
			}
		).map(encodeData, decodeData)
	);

	constructor() {
		const url = new URL(window.location.href);

		const theme = url.searchParams.get("theme");
		if (theme && theme === "dark") {
			this.theme = "dark";
		} else {
			this.theme = "light";
		}
	}
}

export class VisualizationModel {
	constructor(public readonly dataSource: VisualizationDataSource<unknown>) {}

	@computed get visualizations():
		| {
				bestVisualization: Visualization | undefined;
				allVisualizations: Visualization[];
		  }
		| undefined {
		const data = this.dataSource.data;
		if (data.kind === "ok") {
			const vis = globalVisualizationFactory.getVisualizations(
				data.value,
				data.preferredVisualizationId
			);
			return vis;
		} else {
			return undefined;
		}
	}
}
