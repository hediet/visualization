import * as React from "react";
import * as ReactDom from "react-dom";
import { Visualization, Theme } from "./index";
import {
	Visualizer,
	VisualizationId,
	asVisualizationId,
	VisualizationRenderOptions,
} from "./Visualizer";

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
		options: VisualizationRenderOptions<unknown>
	): { renderState: unknown } {
		const node = this.getReactNode({
			theme: options.theme,
			readyCallback: options.readyCallback,
		});
		// We could use this to get access to theme vars:
		//getComputedStyle(target).getPropertyValue("--background-color")

		ReactDom.render(<>{node}</>, target);
		return { renderState: undefined };
	}

	public abstract preload(): Promise<void>;
	protected abstract getReactNode(
		options: ReactVisualizationRenderOptions
	): React.ReactChild;
}

export interface ReactVisualizationRenderOptions {
	theme: Theme;
	readyCallback: () => void;
}

class ReactVisualization extends BaseReactVisualization {
	private readonly _preload?: () => Promise<void>;

	constructor(
		sourceVisualizer: Visualizer,
		options: Options & { preload?: () => Promise<void> },
		private readonly renderReactNode: (
			options: ReactVisualizationRenderOptions
		) => React.ReactChild
	) {
		super(sourceVisualizer, options);
		this._preload = options.preload;
	}

	protected getReactNode(
		options: ReactVisualizationRenderOptions
	): React.ReactChild {
		return this.renderReactNode(options);
	}

	public async preload(): Promise<void> {
		if (this._preload) {
			return await this._preload();
		}
	}
}

export function createReactVisualization(
	sourceVisualizer: Visualizer,
	options: Options & { preload?: () => Promise<void> },
	renderReactNode: (options: { theme: Theme }) => React.ReactChild
) {
	return new ReactVisualization(sourceVisualizer, options, options => (
		<ComponentWithOnMount
			onDidMount={options.readyCallback}
			child={renderReactNode(options)}
		/>
	));
}

class ComponentWithOnMount extends React.Component<{
	child: React.ReactChild;
	onDidMount: () => void;
}> {
	componentDidMount() {
		this.props.onDidMount();
	}

	render() {
		return this.props.child;
	}
}

export function createLazyReactVisualization(
	sourceVisualizer: Visualizer,
	options: Options & { preload?: () => Promise<void> },
	renderReactNode: (
		options: ReactVisualizationRenderOptions
	) => React.ReactChild
) {
	return new ReactVisualization(sourceVisualizer, options, options =>
		renderReactNode(options)
	);
}
