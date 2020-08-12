import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun, reaction } from "mobx";
import { IRef } from "../common/utils";
import { Serializer, JsonSchemaGenerator } from "@hediet/semantic-json";
import { MonacoEditor, getLoadedMonaco } from "@hediet/monaco-editor-react";
import { modelCount } from "./modelCount";

@observer
export class JsonEditor extends React.Component<{
	jsonSrc: IRef<string>;
	serializer: Serializer<any>;
	height?: "dynamic" | "fill";
}> {
	private readonly editorModel = getLoadedMonaco().editor.createModel(
		this.props.jsonSrc.get(),
		"json",
		getLoadedMonaco().Uri.parse(
			`inmemory://inmemory/${modelCount.cur++}.main.json`
		)
	);

	constructor(props: any) {
		super(props);

		const s = new JsonSchemaGenerator();

		getLoadedMonaco().languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			schemas: [
				{
					uri: "https://visualization.hediet.de/schema/v0.1",
					fileMatch: [".main.json"],
					schema: s.getJsonSchemaWithDefinitions(
						this.props.serializer
					),
				},
			],
		});
	}

	render() {
		return (
			<MonacoEditor
				height={{ kind: this.props.height || "fill", maxHeight: 200 }}
				model={this.editorModel}
			/>
		);
	}

	private isUpdating = false;

	@disposeOnUnmount _updateModel = reaction(
		() => this.props.jsonSrc.get(),
		val => {
			if (!this.isUpdating) {
				this.editorModel.setValue(val);
			}
		}
	);

	componentDidMount() {
		this.editorModel.onDidChangeContent(() => {
			this.isUpdating = true;
			this.props.jsonSrc.set(this.editorModel.getValue());
			this.isUpdating = false;
		});
	}
}

@observer
export class TypeScriptPreviewEditor extends React.Component<{
	src: string;
}> {
	private readonly editorModel = getLoadedMonaco().editor.createModel(
		this.props.src,
		"typescript",
		getLoadedMonaco().Uri.parse(
			`inmemory://inmemory/${modelCount.cur++}.ts`
		)
	);

	constructor(props: any) {
		super(props);

		const s = new JsonSchemaGenerator();

		getLoadedMonaco().languages.typescript.typescriptDefaults.setCompilerOptions(
			{
				noLib: true,
			}
		);
		getLoadedMonaco().languages.typescript.typescriptDefaults.setDiagnosticsOptions(
			{
				noSemanticValidation: true,
			}
		);
	}

	render() {
		return <MonacoEditor model={this.editorModel} />;
	}

	componentDidUpdate() {
		this.editorModel.setValue(this.props.src);
	}
}
