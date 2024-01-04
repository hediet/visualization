import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { observable, autorun, trace, computed } from "mobx";
import * as monacoTypes from "monaco-editor";
import { getLanguageId } from "../monaco-text-visualizer/getLanguageId";
import {
	TreeWithPathView,
	TreeViewModel,
	TreeNodeViewModel,
} from "../tree-visualizer/Views";
import { sAstTree } from ".";
import Measure from "react-measure";
import { MonacoEditor, getLoadedMonaco } from "@hediet/monaco-editor-react";
import { Theme } from "@hediet/visualization-core";

export interface NodeInfo {
	start: number;
	length: number;
}

@observer
export class AstTree extends React.Component<{
	model: TreeViewModel<NodeInfo>;
	data: typeof sAstTree.T;
	nodeInfoToRange: (info: NodeInfo) => monacoTypes.IRange;
	posToIndex: (pos: monacoTypes.IPosition) => number;
	theme: Theme;
}> {
	private readonly editorRef = React.createRef<SourceCodeView>();

	render() {
		const { model, data, theme } = this.props;

		let languageId = "text";
		if (data.fileName) {
			languageId = getLanguageId(data.fileName);
		}
		return (
			<Measure client>
				{({
					measureRef,
					contentRect,
				}: {
					measureRef: any;
					contentRect: any;
				}) => {
					return (
						<div
							ref={measureRef}
							className="component-AstTree"
							style={{
								height: "100%",
								display: "flex",
								flexDirection:
									contentRect.client &&
									contentRect.client.width > 1100
										? "row"
										: "column",
							}}
						>
							<div
								className="part-tree2"
								style={{ flex: 1, minHeight: 0, minWidth: 0 }}
							>
								<TreeWithPathView model={model} />
							</div>
							<div
								className="part-editor"
								style={{
									flex: 1,
									minHeight: 0,
									minWidth: 0,
									height: "100%",
								}}
							>
								<SourceCodeView
									theme={theme}
									ref={this.editorRef}
									nodeInfoToRange={this.props.nodeInfoToRange}
									posToIndex={this.props.posToIndex}
									model={model}
									languageId={languageId}
									text={data.text}
								/>
							</div>
						</div>
					);
				}}
			</Measure>
		);
	}
}

@observer
export class SourceCodeView extends React.Component<{
	text: string;
	languageId: string;
	model: TreeViewModel<NodeInfo>;
	theme: Theme;
	nodeInfoToRange: (info: NodeInfo) => monacoTypes.IRange;
	posToIndex: (pos: monacoTypes.IPosition) => number;
}> {
	@observable private editor:
		| monacoTypes.editor.IStandaloneCodeEditor
		| undefined;

	private markedDecorations: string[] = [];
	private selectedDecorations: string[] = [];

	constructor(props: any) {
		super(props);
	}

	layout() {
		if (this.editor) {
			this.editor.layout();
		}
	}

	@computed.struct
	private get markedRanges(): monacoTypes.IRange[] {
		if (!this.editor || !this.model) {
			return [];
		}

		const editorModel = this.model;
		const ranges = this.props.model.marked.map(s =>
			this.props.nodeInfoToRange(s.data)
		);
		return ranges;
	}

	@disposeOnUnmount
	private _updateMarkedDecorations = autorun(
		() => {
			if (!this.editor) {
				return;
			}
			const ranges = this.markedRanges;
			this.markedDecorations = this.editor.deltaDecorations(
				this.markedDecorations,
				ranges.map(range => ({
					range,
					options: { className: "marked" },
				}))
			);
			if (ranges.length > 0) {
				this.editor.revealRange(
					ranges[0],
					getLoadedMonaco().editor.ScrollType.Smooth
				);
			}
		},
		{ name: "updateMarkedDecorations" }
	);

	@computed.struct
	private get selected(): monacoTypes.IRange | undefined {
		if (this.editor && this.model) {
			const selected = this.props.model.selected;
			if (selected) {
				const range = this.props.nodeInfoToRange(selected.data);
				return range;
			}
		}
		return undefined;
	}

	@disposeOnUnmount
	private _updateSelectedDecoration = autorun(
		() => {
			console.log("_updateSelectedDecoration");
			if (!this.editor) {
				return;
			}
			const range = this.selected;
			if (range) {
				this.selectedDecorations = this.editor.deltaDecorations(
					this.selectedDecorations,
					[
						{
							range,
							options: { className: "selected" },
						},
					]
				);
				this.editor.revealRange(
					range,
					getLoadedMonaco().editor.ScrollType.Smooth
				);
			} else {
				this.selectedDecorations = this.editor.deltaDecorations(
					this.selectedDecorations,
					[]
				);
			}
		},
		{ name: "updateDecorations" }
	);

	@computed.struct
	private get modelData(): { text: string; languageId: string } {
		const { text, languageId } = this.props;
		return { text, languageId };
	}

	private lastModel: monacoTypes.editor.ITextModel | undefined;
	@computed get model(): monacoTypes.editor.ITextModel {
		const last = this.lastModel;
		this.lastModel = getLoadedMonaco().editor.createModel(
			this.modelData.text,
			this.modelData.languageId,
			undefined
		);
		if (last) {
			setTimeout(() => {
				// we don't want to dispose the current model
				last.dispose();
			});
		}
		return this.lastModel;
	}

	render() {
		return (
			<MonacoEditor
				model={this.model}
				theme={this.props.theme.kind === "dark" ? "vs-dark" : "vs"}
				onEditorLoaded={e => {
					this.editor = e;
					e.onDidChangeCursorSelection(e => {
						const selectionStart = this.props.posToIndex(
							e.selection.getStartPosition()
						);
						const selectionEnd = this.props.posToIndex(
							e.selection.getEndPosition()
						);

						const findNode = (
							m: TreeNodeViewModel<NodeInfo>
						): TreeNodeViewModel<NodeInfo> | undefined => {
							const nodeStart = m.data.start;
							const nodeEnd = nodeStart + m.data.length;

							if (
								!(
									nodeStart <= selectionStart &&
									selectionEnd <= nodeEnd
								)
							) {
								return undefined;
							}

							for (const c of m.children) {
								const r = findNode(c);
								if (r) {
									return r;
								}
							}

							return m;
						};

						if (this.props.model.root) {
							const n = findNode(this.props.model.root);
							if (n) {
								this.props.model.select(n);
							}
						}
					});
				}}
				readOnly={true}
			/>
		);
	}
}
