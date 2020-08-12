import React = require("react");
import { hotComponent } from "../common/hotComponent";
import { Model } from "../model/Model";
import { MainView } from "./MainView";
import { observable, runInAction } from "mobx";
import { observer } from "mobx-react";
import "../visualizations";
import { loadMonaco, getMonaco } from "@hediet/monaco-editor-react";

@hotComponent(module)
@observer
export class App extends React.Component {
	@observable model: Model | undefined;

	constructor(props: {}) {
		super(props);
		this.init();
	}

	async init() {
		if (!getMonaco()) {
			await loadMonaco();
		}
		runInAction(() => {
			this.model = new Model();
		});
	}

	render() {
		if (!this.model) {
			return <div>Loading...</div>;
		}
		return <MainView model={this.model} />;
	}
}
