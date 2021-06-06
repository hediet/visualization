import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun } from "mobx";
import * as monacoTypes from "monaco-editor";
import { Theme } from "@hediet/visualization-core";
import { getLoadedMonaco } from "@hediet/monaco-editor-react";

export function getLanguageId(fileName: string): string {
	const l = getLoadedMonaco().languages.getLanguages();
	const result = l.find(l => {
		if (l.filenamePatterns) {
			for (const p of l.filenamePatterns) {
				if (new RegExp(p).test(fileName)) {
					return true;
				}
			}
		}
		if (l.extensions) {
			for (const p of l.extensions) {
				if (fileName.endsWith(p)) {
					return true;
				}
			}
		}

		return false;
	});

	if (result) {
		return result.id;
	}
	return "text";
}

@observer
export class MonacoDiffEditor extends React.Component<{
	originalText: string;
	modifiedText: string;
	fileName?: string;
	theme: Theme;
}> {
	@observable private editor:
		| monacoTypes.editor.IStandaloneDiffEditor
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

	private originalModel:
		| monacoTypes.editor.ITextModel
		| undefined = undefined;
	private modifiedModel:
		| monacoTypes.editor.ITextModel
		| undefined = undefined;

	@disposeOnUnmount
	private _updateText = autorun(() => {
		if (this.editor) {
			const originalModel = getLoadedMonaco().editor.createModel(
				this.props.originalText,
				this.languageId,
				undefined
			);
			const modifiedModel = getLoadedMonaco().editor.createModel(
				this.props.modifiedText,
				this.languageId,
				undefined
			);

			this.editor.setModel({
				original: originalModel,
				modified: modifiedModel,
			});

			if (this.originalModel) {
				this.originalModel.dispose();
			}
			this.originalModel = originalModel;

			if (this.modifiedModel) {
				this.modifiedModel.dispose();
			}
			this.modifiedModel = modifiedModel;
		}
	});

	private readonly setEditorDiv = (editorDiv: HTMLDivElement) => {
		if (!editorDiv) {
			return;
		}
		this.editor = getLoadedMonaco().editor.createDiffEditor(editorDiv, {
			automaticLayout: true,
			scrollBeyondLastLine: false,
			minimap: { enabled: false },
			fixedOverflowWidgets: true,
			readOnly: true,
			theme: this.props.theme.kind === "dark" ? "vs-dark" : "vs",
			renderWhitespace: "all",
		});
		if (this.originalModel && this.modifiedModel) {
			this.editor.setModel({
				original: this.originalModel!,
				modified: this.modifiedModel!,
			});
		}
	};

	render() {
		return (
			<div className="component-monaco-editor-diff-visualizer">
				<div className="part-editor" ref={this.setEditorDiv} />
			</div>
		);
	}
}
