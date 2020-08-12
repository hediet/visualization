import {
	VisualizationDataSource,
	VisualizationDataSourceState,
} from "./VisualizationDataSource";
import { observable, computed } from "mobx";
import {
	VisualizationData,
	VisualizationId,
	globalVisualizationFactory,
} from "@hediet/visualization-core";
import * as React from "react";
import { JsonEditor } from "../components/JsonEditor";
import { ref, Animator, Ref } from "../common/utils";

type State = { json: string; prefVisId: string | undefined };

export class JsonDataSource implements VisualizationDataSource<State> {
	@observable jsonSrc: string = "";
	@observable preferredVisualizationId: VisualizationId | undefined;

	readonly editorView = (<EditorView jsonSrc={ref(this, "jsonSrc")} />);

	@observable timePassed = 0;

	@computed
	get state(): State {
		return {
			json: this.jsonSrc,
			prefVisId: this.preferredVisualizationId as any,
		};
	}

	public setState(state: State): void {
		this.jsonSrc = state.json;
		this.preferredVisualizationId = state.prefVisId as any;
	}

	constructor(initialState?: State) {
		if (initialState) {
			this.setState(initialState);
		}
	}

	public setPreferredVisualizationId(id: VisualizationId | undefined): void {
		this.preferredVisualizationId = id;
	}

	private get normalizedData():
		| {
				kind: "ok";
				items: {
					data: VisualizationData;
					durationMs: number;
					preferredVisualizationId: VisualizationId | undefined;
				}[];
		  }
		| { kind: "error"; error: string } {
		try {
			var value = JSON.parse(this.jsonSrc);
		} catch (e) {
			return {
				kind: "error",
				error: "" + e,
			};
		}

		if (!Array.isArray(value)) {
			value = [value];
		}

		if (value.length === 0) {
			return { kind: "error", error: "bla" };
		}

		const items = value.map((v: any) => ({
			data: v,
			durationMs: Number(v["playground-durationMs"]) || 1500,
			preferredVisualizationId: v["playground-preferredVisualizationId"],
		}));

		return { kind: "ok", items };
	}

	@computed.struct get times(): number[] {
		if (this.normalizedData.kind === "ok") {
			return this.normalizedData.items.map(i => i.durationMs);
		}
		return [1000];
	}

	private lastAnimator: Animator | undefined;

	@computed get animator(): Animator {
		if (this.lastAnimator) {
			this.lastAnimator.dispose();
		}
		return (this.lastAnimator = new Animator(this.times));
	}

	@computed
	get data(): VisualizationDataSourceState {
		if (this.normalizedData.kind === "error") {
			return this.normalizedData;
		}

		return {
			kind: "ok",
			value: this.normalizedData.items[this.animator.index].data,
			preferredVisualizationId: this.preferredVisualizationId,
		};
	}
}

class EditorView extends React.Component<{ jsonSrc: Ref<string> }> {
	render() {
		return (
			<JsonEditor
				serializer={globalVisualizationFactory.getSerializer()}
				jsonSrc={this.props.jsonSrc}
			/>
		);
	}
}
