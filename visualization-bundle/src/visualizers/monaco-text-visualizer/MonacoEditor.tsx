import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun } from "mobx";
import * as monacoTypes from "monaco-editor";
import { Theme } from "@hediet/visualization-core";
import { getLoadedMonaco } from "@hediet/monaco-editor-react";
import { getLanguageId } from "./getLanguageId";

export interface Decoration {
	label?: string;
	range: monacoTypes.IRange;
}

@observer
export class MonacoEditor extends React.Component<{
	text: string;
	theme: Theme;
	fileName?: string;
	decorations?: Decoration[];
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

	private prevDecorations: string[] = [];

	@disposeOnUnmount
	private _updateText = autorun(() => {
		if (this.editor) {
			const decorations = new Array<
				monacoTypes.editor.IModelDeltaDecoration
			>();
			const propDecorations = this.props.decorations || [];
			const lines = this.props.text.split("\n");
			const mappedLines = lines.map((l, idx) => {
				if (idx === lines.length - 1) {
					return l;
				}

				if (
					!propDecorations.some(
						d =>
							((d.range.endLineNumber === idx + 2 &&
								d.range.endColumn === 1) ||
								(d.range.startLineNumber === idx + 1 &&
									d.range.startColumn >= l.length + 1)) &&
							(d.range.startColumn !== d.range.endColumn ||
								d.range.startLineNumber !==
									d.range.endLineNumber)
					)
				) {
					return l;
				}

				decorations.push({
					range: {
						startLineNumber: idx + 1,
						endLineNumber: idx + 1,
						startColumn: l.length + 1,
						endColumn: l.length + 2,
					},
					options: {
						inlineClassName: "decoration-whitespace",
					},
				});
				return l + "␊"; // ␍␊
			});
			const text = mappedLines.join("\n");

			const model = getLoadedMonaco().editor.createModel(
				text,
				this.languageId,
				undefined
			);

			this.editor.setModel(model);

			this.prevDecorations = this.editor.deltaDecorations(
				[],
				[
					...decorations,
					...propDecorations.map(d => {
						const r = getLoadedMonaco().Range.lift(d.range);
						return {
							range: r,
							options: {
								hoverMessage: d.label
									? { value: d.label, isTrusted: false }
									: undefined,
								className: r.isEmpty()
									? "decoration-empty"
									: "decoration",
							},
						};
					}),
				]
			);

			/*
			this.editor!.updateOptions({ readOnly: false });

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
			renderWhitespace: "all",
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
