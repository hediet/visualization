import * as React from "react";
import * as ReactDom from "react-dom";
import { Visualization, Theme } from "./index";
import { Visualizer, VisualizationId, asVisualizationId } from "./Visualizer";

interface Options {
	id?: string;
	name?: string;
	priority: number;
}

export abstract class BaseReactVisualization implements Visualization<unknown> {
	public readonly id: VisualizationId;
	public readonly name: string;
	public readonly priority: number;

	constructor(
		public readonly sourceVisualizer: Visualizer,
		options: Options
	) {
		this.id = asVisualizationId(
			options.id || sourceVisualizer.id.toString()
		);
		this.name = options.name || sourceVisualizer.name;
		this.priority = options.priority;
	}

	public render(
		target: HTMLDivElement,
		theme: Theme,
		previous: unknown | undefined
	): unknown {
		const node = this.getReactNode(theme);
		// We could use this to get access to theme vars:
		// getComputedStyle(target).getPropertyValue("--background-color")

		ReactDom.render(<>{node}</>, target);
		return undefined;
	}

	protected abstract getReactNode(theme: Theme): React.ReactChild;
}

export class ReactVisualization extends BaseReactVisualization {
	constructor(
		sourceVisualizer: Visualizer,
		options: Options,
		private readonly renderReactNode: (theme: Theme) => React.ReactChild
	) {
		super(sourceVisualizer, options);
	}

	protected getReactNode(theme: Theme): React.ReactChild {
		return this.renderReactNode(theme);
	}
}
