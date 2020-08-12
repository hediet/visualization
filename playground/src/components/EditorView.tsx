import React = require("react");
import { observer } from "mobx-react";
import { hotComponent } from "../common/hotComponent";
import { PlaygroundDocumentEditor } from "./PlaygroundDocumentEditor";
import { VSCodeBrigde } from "./VSCodeBrigde";
import { Model } from "../model/Model";

@hotComponent(module)
@observer
export class EditorView extends React.Component<{ model: Model }> {
	private readonly vscodeBridge = new VSCodeBrigde();

	render() {
		return (
			<div style={{ margin: 10 }}>
				<h1>Visualization Playground Editor</h1>
				<PlaygroundDocumentEditor
					model={this.props.model}
					document={this.vscodeBridge.currentDocument}
					editableCaptions={true}
				/>
			</div>
		);
	}
}
