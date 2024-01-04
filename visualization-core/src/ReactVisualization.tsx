import * as React from "react";
import * as ReactDom from "react-dom";
import { Visualization, Theme } from "./index";
import {
	Visualizer,
	VisualizationId,
	asVisualizationId,
	VisualizationRenderOptions,
} from "./Visualizer";
import { Deferred } from "@hediet/std/synchronization";

interface ReactVisualizationArgs {
	priority: number;
	preload?: (() => Promise<void>) | undefined;
}

class ReactVisualization implements Visualization<unknown> {
	public readonly id: VisualizationId;
	public readonly name: string;
	public readonly priority: number;
	private readonly _preload: (() => Promise<void>) | undefined;

	constructor(
		public readonly sourceVisualizer: Visualizer,
		options: ReactVisualizationArgs,
		private readonly getReactNode: (
			options: ReactVisualizationRenderArgs
		) => {
			node: React.ReactChild;
			ready: Promise<void>;
		}
	) {
		this.id = asVisualizationId(sourceVisualizer.id.toString());
		this.name = sourceVisualizer.name;
		this.priority = options.priority;
		this._preload = options.preload;
	}

	public preload(): Promise<void> {
		return this._preload ? this._preload() : Promise.resolve();
	}

	public render(
		target: HTMLDivElement,
		options: VisualizationRenderOptions<unknown>
	): { renderState: unknown; ready: Promise<void> } {
		const { node, ready } = this.getReactNode({
			theme: options.theme,
		});
		// We could use this to get access to theme vars:
		// getComputedStyle(target).getPropertyValue("--background-color")

		ReactDom.render(<>{node}</>, target);
		return { renderState: undefined, ready };
	}
}

export interface ReactVisualizationRenderArgs {
	theme: Theme;
}

export function createReactVisualization(
	sourceVisualizer: Visualizer,
	args: ReactVisualizationArgs,
	renderReactNode: (args: ReactVisualizationRenderArgs) => React.ReactChild
) {
	return new ReactVisualization(sourceVisualizer, args, options => {
		const deferred = new Deferred();
		return {
			node: (
				<ComponentWithOnMount
					onDidMount={() => deferred.resolve()}
					child={renderReactNode(options)}
				/>
			),
			ready: deferred.promise,
		};
	});
}

class ComponentWithOnMount extends React.Component<{
	child: React.ReactChild;
	onDidMount: () => void;
}> {
	componentDidMount() {
		this.props.onDidMount();
	}

	render(): React.ReactNode {
		return this.props.child;
	}
}

export function createLazyReactVisualization(
	sourceVisualizer: Visualizer,
	args: ReactVisualizationArgs,
	renderReactNode: (
		args: ReactVisualizationRenderArgs
	) => {
		node: React.ReactChild;
		ready: Promise<void>;
	}
) {
	return new ReactVisualization(sourceVisualizer, args, renderReactNode);
}
