import { hotComponent } from "../common/hotComponent";
import * as React from "react";
import { Model, VisualizationModel } from "../model/Model";
import {
	VisualizationData,
	VisualizationId,
	Theme,
	VisualizationFactory,
	globalVisualizationFactory,
	VisualizationView,
	isVisualizationData,
	Visualization,
	asVisualizationId,
} from "@hediet/visualization-core";
import { observer } from "mobx-react";
import { EditableText, Checkbox, Button } from "@blueprintjs/core";
import { JsonEditor, TypeScriptPreviewEditor } from "./JsonEditor";
import { ref } from "../common/utils";
import { computed, observable, runInAction, autorun } from "mobx";
import { TypeScriptTypeGenerator } from "@hediet/semantic-json";
import { QueryBinding } from "../model/QueryController";
import { JsonDataSource } from "../model/JsonDataSource";
import { Select } from "./Select";

@hotComponent(module)
@observer
export class PlaygroundDocumentEditor extends React.Component<{
	document: PlaygroundDocument;
	model: Model;
	editableCaptions: boolean;
}> {
	@observable showLightTheme = false;
	@observable showDarkTheme = true;
	@observable showTypeScriptTypes = false;

	constructor(props: any) {
		super(props);

		new QueryBinding(
			"lightTheme",
			ref(this, "showLightTheme").map(
				val => (val ? ("1" as string) : undefined),
				val => val !== undefined
			)
		);
		new QueryBinding(
			"darkTheme",
			ref(this, "showDarkTheme").map(
				val => (val ? ("1" as string) : undefined),
				val => val !== undefined
			)
		);
		new QueryBinding(
			"tsTypes",
			ref(this, "showTypeScriptTypes").map(
				val => (val ? ("1" as string) : undefined),
				val => val !== undefined
			)
		);
	}

	render() {
		const { document, model } = this.props;
		return (
			<div>
				<div style={{ display: "flex" }}>
					<Checkbox
						style={{ marginRight: 16 }}
						label="Show Light Theme"
						checked={this.showLightTheme}
						onChange={e =>
							(this.showLightTheme = e.currentTarget.checked)
						}
					/>
					<Checkbox
						style={{ marginRight: 16 }}
						label="Show Dark Theme"
						checked={this.showDarkTheme}
						onChange={e =>
							(this.showDarkTheme = e.currentTarget.checked)
						}
					/>
					<Checkbox
						style={{ marginRight: 16 }}
						label="Show TypeScript Types"
						checked={this.showTypeScriptTypes}
						onChange={e =>
							(this.showTypeScriptTypes = e.currentTarget.checked)
						}
					/>
				</div>
				<div>
					{document.visualizations.map((v, idx) => (
						<VisualizationConfigView
							model={model}
							showLightTheme={this.showLightTheme}
							showDarkTheme={this.showDarkTheme}
							showTypeScriptTypes={this.showTypeScriptTypes}
							key={idx}
							config={v}
							editableCaptions={this.props.editableCaptions}
						/>
					))}
				</div>
			</div>
		);
	}
}

export interface PlaygroundDocument {
	visualizations: VisualizationInfo[];
}

export interface VisualizationInfo {
	name: string;
	dataSrc: string;
	preferredVisualizationId: VisualizationId | undefined;
}

type VisualizationDataResult =
	| {
			kind: "ok";
			value: VisualizationData;
	  }
	| { kind: "error"; message: string };

function parseVisualizationData(json: string): VisualizationDataResult {
	try {
		const value = JSON.parse(json);
		if (isVisualizationData(value)) {
			return { kind: "ok", value };
		}
		return {
			kind: "error",
			message: "Data is not welformed visualization data.",
		};
	} catch (e) {
		return { kind: "error", message: "" + e };
	}
}

@observer
class VisualizationConfigView extends React.Component<{
	config: VisualizationInfo;
	showLightTheme: boolean;
	showDarkTheme: boolean;
	showTypeScriptTypes: boolean;
	model: Model;
	editableCaptions: boolean;
}> {
	@computed get data():
		| {
				kind: "ok";
				visualization: Visualization;
				typeScriptDeclarationSrc: string;
				availableVisualizations: Visualization[];
		  }
		| {
				kind: "error";
				message: string;
				availableVisualizations: Visualization[];
		  } {
		const r = parseVisualizationData(this.props.config.dataSrc);

		if (r.kind === "error") {
			return Object.assign({ availableVisualizations: [] }, r);
		}

		const visualizations = globalVisualizationFactory.getVisualizations(
			r.value,
			this.props.config.preferredVisualizationId
		);

		if (visualizations.bestVisualization) {
			const tsTypeGenerator = new TypeScriptTypeGenerator();
			const typeSrc = tsTypeGenerator.getType(
				visualizations.bestVisualizationVisualizer!.serializer.asSerializer()
			);
			const decl = tsTypeGenerator.getDefinitionSource();
			return {
				kind: "ok",
				visualization: visualizations.bestVisualization,
				availableVisualizations: visualizations.allVisualizations,
				typeScriptDeclarationSrc: `type ExpectedType = ${typeSrc};\n\n${decl}`,
			};
		}

		return {
			kind: "error",
			message: "No Visualization Available",
			availableVisualizations: visualizations.allVisualizations,
		};
	}

	render() {
		const {
			config,
			showDarkTheme,
			showLightTheme,
			showTypeScriptTypes,
			editableCaptions,
		} = this.props;

		const themes = new Array<Theme>();
		if (showDarkTheme) {
			themes.push(Theme.dark);
		}
		if (showLightTheme) {
			themes.push(Theme.light);
		}

		return (
			<div>
				<div style={{ display: "flex", alignItems: "center" }}>
					<h2>
						<EditableText
							disabled={!editableCaptions}
							value={config.name}
							onChange={e => (config.name = e)}
						/>
					</h2>
					<div style={{ width: 32 }} />
					<Select<Visualization<any>>
						style={{ minWidth: 100 }}
						options={this.data.availableVisualizations}
						idSelector={v => v.id.toString()}
						labelSelector={v => v.name}
						selected={
							this.data.kind === "ok"
								? this.data.visualization
								: undefined
						}
						onSelect={e =>
							runInAction(() => {
								config.preferredVisualizationId = e.id;
							})
						}
					/>
					<div style={{ width: 8 }} />
					<Button
						onClick={() => {
							this.props.model.visualization = new VisualizationModel(
								new JsonDataSource({
									json: config.dataSrc,
									prefVisId: config.preferredVisualizationId as any,
								})
							);
						}}
					>
						Open
					</Button>
				</div>
				<div style={{ display: "flex" }}>
					{themes.map((theme, idx) => (
						<div
							key={idx}
							style={{
								width: 500,
								height: 300,
								marginRight: 10,
								overflow: "auto",
								border: "1px solid black",
							}}
						>
							{this.data.kind === "ok" ? (
								<VisualizationView
									theme={theme}
									visualization={this.data.visualization}
								/>
							) : (
								<div />
							)}
						</div>
					))}
					<div
						style={{
							width: 500,
							height: 300,
							marginRight: 10,
							border: "1px solid black",
							overflow: "visible",
						}}
					>
						<JsonEditor
							jsonSrc={ref(config, "dataSrc")}
							serializer={globalVisualizationFactory.getSerializer()}
						/>
					</div>
					{showTypeScriptTypes && (
						<div
							style={{
								width: 500,
								height: 300,
								marginRight: 10,
								border: "1px solid black",
								overflow: "visible",
							}}
						>
							<TypeScriptPreviewEditor
								src={
									this.data.kind === "ok"
										? this.data.typeScriptDeclarationSrc
										: ""
								}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
