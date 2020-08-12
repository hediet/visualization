import {
	VisualizationView,
	Theme,
	globalVisualizationFactory,
	VisualizationData,
} from "@hediet/visualization-core";

// This registers all visualizations
import "@hediet/visualization-bundle";

import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.scss";

class App extends React.Component {
	render() {
		const data = {
			kind: { graph: true as true },
			nodes: [
				{ id: "1", label: "1" },
				{ id: "2", label: "2", color: "orange" },
				{ id: "3", label: "3" },
			],
			edges: [
				{ from: "1", to: "2", color: "red" },
				{ from: "1", to: "3" },
			],
		};

		const visualizations = globalVisualizationFactory.getVisualizations(
			data,
			undefined
		);

		return (
			<VisualizationView
				theme={Theme.light}
				visualization={visualizations.bestVisualization!}
			/>
		);
	}
}

const elem = document.createElement("div");
elem.className = "react-root";
document.body.append(elem);
ReactDOM.render(<App />, elem);
