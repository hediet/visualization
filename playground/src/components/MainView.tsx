import React = require("react");
import { observer } from "mobx-react";
import { hotComponent } from "../common/hotComponent";
import { Model } from "../model/Model";
import { DemoView } from "./DemoView";
import { getQueryParam } from "../model/QueryController";
import { EditorView } from "./EditorView";
import { VisualizationWithEditorView } from "./VisualizationWithEditorView";

@hotComponent(module)
@observer
export class MainView extends React.Component<{ model: Model }> {
	render() {
		const { model } = this.props;
		if (model.visualization) {
			return (
				<VisualizationWithEditorView
					model={model}
					visualizationModel={model.visualization}
				/>
			);
		}
		if (getQueryParam("editor") !== null) {
			return <EditorView model={model} />;
		}
		return <DemoView model={model} />;
	}
}
