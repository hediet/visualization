import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun } from "mobx";
import * as monacoTypes from "monaco-editor";
import { Theme } from "@hediet/visualization-core";
import { getLoadedMonaco } from "@hediet/monaco-editor-react";
import { getLanguageId } from "./getLanguageId";

@observer
export class MonacoEditor extends React.Component<{
	text: string;
	theme: Theme;
	fileName?: string;
}> {
	@observable private editor:
		| monacoTypes.editor.IStandaloneCodeEditor
		| undefined;

	componentWillUnmount() {
		if (this.editor) {
			this.editor.dispose();
		}
	}

	get languageId(): string {
		if (!this.props.fileName) {
			return "text";
		}
		return getLanguageId(this.props.fileName);
	}

	private model: monacoTypes.editor.ITextModel | undefined = undefined;

	@disposeOnUnmount
	private _updateText = autorun(() => {
		if (this.editor) {
			const model = getLoadedMonaco().editor.createModel(
				this.props.text,
				this.languageId,
				undefined
			);

			this.editor.setModel(model);

			/*			this.editor!.updateOptions({ readOnly: false });

            setTimeout(() => {
                const a = this.editor!.getAction(
                    "editor.action.formatDocument"
                );
                a.run().then(() => {
                    this.editor!.updateOptions({ readOnly: true });
                });
            }, 200);*/
			if (this.model) {
				this.model.dispose();
			}
			this.model = model;
		}
	});

	private readonly setEditorDiv = (editorDiv: HTMLDivElement) => {
		if (!editorDiv) {
			return;
		}
		this.editor = getLoadedMonaco().editor.create(editorDiv, {
			model: null,
			automaticLayout: true,
			scrollBeyondLastLine: false,
			minimap: { enabled: false },
			fixedOverflowWidgets: true,
			readOnly: true,
			theme: this.props.theme.kind === "dark" ? "vs-dark" : "vs",
		});
	};

	render() {
		return (
			<div className="component-monaco-editor">
				<div className="part-editor" ref={this.setEditorDiv} />
			</div>
		);
	}
}
