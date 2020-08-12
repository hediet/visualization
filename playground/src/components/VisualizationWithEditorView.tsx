import * as React from "react";
import { observer, disposeOnUnmount } from "mobx-react";
import { Model, VisualizationModel } from "../model/Model";
import classnames = require("classnames");
import {
	VisualizationView,
	Theme,
	Visualization,
} from "@hediet/visualization-core";
import { Button, HTMLSelect, ButtonGroup } from "@blueprintjs/core";
import { observable, computed, runInAction } from "mobx";
import { QueryBinding } from "../model/QueryController";
import { ref } from "../common/utils";
import { Select } from "./Select";

@observer
export class VisualizationWithEditorView extends React.Component<{
	model: Model;
	visualizationModel: VisualizationModel;
}> {
	@observable showEditor = true;
	@computed get theme(): Theme {
		if (this.themeId === "dark") {
			return Theme.dark;
		}
		return Theme.light;
	}

	@observable themeId: string | undefined;

	private readonly themeQueryBinding = new QueryBinding(
		"theme",
		ref(this, "themeId")
	);

	render() {
		const { visualizationModel, model } = this.props;

		return (
			<div
				className="component-GUI"
				style={{
					display: "flex",
					flexDirection: "column",
					height: "100%",
					minHeight: 0,
				}}
			>
				<div
					className="part-header"
					style={{ margin: 6, display: "flex" }}
				>
					<Button
						icon={"arrow-left"}
						onClick={() => {
							model.visualization = undefined;
						}}
					>
						Demos
					</Button>
					<div style={{ width: 6 }} />
					<Button
						active={this.showEditor}
						onClick={() => (this.showEditor = !this.showEditor)}
					>
						Show Editor
					</Button>
					<div style={{ width: 6 }} />
					<HTMLSelect
						options={[
							{ value: "light", label: "Light" },
							{ value: "dark", label: "Dark" },
						]}
						value={this.themeId}
						onChange={e => (this.themeId = e.currentTarget.value)}
					/>
					<div style={{ width: 6 }} />

					<Select<Visualization<any>>
						style={{ minWidth: 100 }}
						options={
							(
								visualizationModel.visualizations || {
									allVisualizations: [],
								}
							).allVisualizations
						}
						idSelector={v => v.id.toString()}
						labelSelector={v => v.name}
						selected={
							visualizationModel.visualizations
								? visualizationModel.visualizations
										.bestVisualization
								: undefined
						}
						onSelect={e =>
							runInAction(() => {
								visualizationModel.dataSource.setPreferredVisualizationId(
									e.id
								);
							})
						}
					/>
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "row-reverse",
						flex: 1,
						minHeight: 0,
					}}
				>
					{this.showEditor && (
						<div
							className="part-header"
							style={{
								flex: 1,
								minHeight: 0,
								minWidth: 0,
								overflow: "hidden",
							}}
						>
							{visualizationModel.dataSource.editorView}
						</div>
					)}
					<div
						className="part-visualization"
						style={{
							minHeight: 0,
							minWidth: 0,
							flex: 1,
							border: "1px solid rgba(128, 128, 128, 0.15)",
						}}
					>
						{this.renderVisualization()}
					</div>
				</div>
			</div>
		);
	}

	renderVisualization() {
		const { visualizationModel: model } = this.props;
		const visualizations = model.visualizations;

		if (!visualizations) {
			return <div>No/Invalid Data</div>;
		}
		if (!visualizations.bestVisualization) {
			return <div>Data cannot be visualized</div>;
		}
		return (
			<VisualizationView
				theme={this.theme}
				visualization={visualizations.bestVisualization}
			/>
		);
	}
}
