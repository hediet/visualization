import { hotComponent } from "../common/hotComponent";
import { observer } from "mobx-react";
import React = require("react");
import { PlaygroundDocumentEditor } from "./PlaygroundDocumentEditor";
import { observable } from "mobx";
import { Model } from "../model/Model";

const demoData = require("../demo.editable.json");

@hotComponent(module)
@observer
export class DemoView extends React.Component<{ model: Model }> {
	render() {
		return (
			<div style={{ margin: 10 }}>
				<h1>Visualization Playground</h1>
				<PlaygroundDocumentEditor
					model={this.props.model}
					document={observable(demoData)}
					editableCaptions={false}
				/>
			</div>
		);
	}
}
