import { Theme } from "@hediet/visualization-core";
import { observer } from "mobx-react";
import * as React from "react";
import Plot from "react-plotly.js";

// needs to be overwriten since the table layout is not defined in @types/plotly.js
interface PlotlyLayoutAnyTemplate extends Plotly.Layout {
	template: any;
}

@observer
export class PlotlyViewer extends React.Component<{
	data: Plotly.Data[];
	layout?: Partial<Plotly.Layout>;
	theme: Theme;
	onReady: () => void;
}> {
	render() {
		const { theme, data, layout } = this.props;
		const computedLayout = Object.assign(
			{},
			theme.id === "dark" ? getLayout(theme) : {},
			layout || {}
		);

		if (
			data.length === 1 &&
			data[0].type === "mesh3d" &&
			(layout || {}).margin === undefined
		) {
			// Fixes https://github.com/JetBrains/rider-debug-visualizer-web-view/issues/6
			Object.assign(computedLayout, {
				margin: {
					l: 0,
					r: 0,
					b: 0,
					t: 0,
					pad: 0,
				},
			});
		}

		return (
			<Plot
				style={{ width: "100%", height: "100%" }}
				data={data}
				layout={computedLayout}
				config={{ responsive: true }}
				onInitialized={this.props.onReady}
			/>
		);
	}
}

function getLayout(theme: Theme): Partial<PlotlyLayoutAnyTemplate> {
	return {
		colorway: [
			"#636efa",
			"#EF553B",
			"#00cc96",
			"#ab63fa",
			"#19d3f3",
			"#e763fa",
			"#fecb52",
			"#ffa15a",
			"#ff6692",
			"#b6e880",
		],
		autosize: true,
		font: { color: "#f2f5fa" },
		title: { x: 0.05 },
		paper_bgcolor: theme.resolveVarToColor("--visualizer-background"), // "rgb(17,17,17)",
		plot_bgcolor: theme.resolveVarToColor("--visualizer-background"), // "rgb(17,17,17)",
		hovermode: "closest",
		polar: {
			bgcolor: theme.resolveVarToColor("--visualizer-background"),
			angularaxis: {
				gridcolor: "#506784",
				linecolor: "#506784",
				ticks: "",
			},
			radialaxis: {
				gridcolor: "#506784",
				linecolor: "#506784",
				ticks: "",
			},
		},
		ternary: {
			bgcolor: theme.resolveVarToColor("--visualizer-background"),
			aaxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
			baxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
			caxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
		},
		xaxis: {
			gridcolor: "#283442",
			linecolor: "#506784",
			ticks: "",
			zerolinecolor: "#283442",
			zerolinewidth: 2,
			automargin: true,
		},
		yaxis: {
			gridcolor: "#283442",
			linecolor: "#506784",
			ticks: "",
			zerolinecolor: "#283442",
			zerolinewidth: 2,
			automargin: true,
		},
		scene: {
			xaxis: {
				gridcolor: "#506784",
				linecolor: "#506784",
				showbackground: false,
				ticks: "",
				zerolinecolor: "#C8D4E3",
				gridwidth: 2,
			},
			yaxis: {
				gridcolor: "#506784",
				linecolor: "#506784",
				showbackground: false,
				ticks: "",
				zerolinecolor: "#C8D4E3",
				gridwidth: 2,
			},
			zaxis: {
				gridcolor: "#506784",
				linecolor: "#506784",
				showbackground: false,
				ticks: "",
				zerolinecolor: "#C8D4E3",
				gridwidth: 2,
			},
		},
		geo: {
			bgcolor: theme.resolveVarToColor("--visualizer-plotly-background"),
			landcolor: theme.resolveVarToColor(
				"--visualizer-plotly-background"
			),
			subunitcolor: "#506784",
			showland: true,
			showlakes: true,
			lakecolor: theme.resolveVarToColor(
				"--visualizer-plotly-background"
			),
		},
		template: {
			data: {
				table: [{
					cells: { fill: { color: theme.resolveVarToColor("--visualizer-background") } },
					header: { fill: { color: "rgb(17, 17, 17)" } },
				}]
			}
		}
	};
}

// extracted from the plotly website
const darkLayout: Partial<PlotlyLayoutAnyTemplate> = {
	colorway: [
		"#636efa",
		"#EF553B",
		"#00cc96",
		"#ab63fa",
		"#19d3f3",
		"#e763fa",
		"#fecb52",
		"#ffa15a",
		"#ff6692",
		"#b6e880",
	],
	autosize: true,
	font: { color: "#f2f5fa" },
	title: { x: 0.05 },
	paper_bgcolor: "rgb(17,17,17)",
	plot_bgcolor: "rgb(17,17,17)",
	hovermode: "closest",
	polar: {
		bgcolor: "rgb(17,17,17)",
		angularaxis: {
			gridcolor: "#506784",
			linecolor: "#506784",
			ticks: "",
		},
		radialaxis: {
			gridcolor: "#506784",
			linecolor: "#506784",
			ticks: "",
		},
	},
	ternary: {
		bgcolor: "rgb(17,17,17)",
		aaxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
		baxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
		caxis: { gridcolor: "#506784", linecolor: "#506784", ticks: "" },
	},
	xaxis: {
		gridcolor: "#283442",
		linecolor: "#506784",
		ticks: "",
		zerolinecolor: "#283442",
		zerolinewidth: 2,
		automargin: true,
	},
	yaxis: {
		gridcolor: "#283442",
		linecolor: "#506784",
		ticks: "",
		zerolinecolor: "#283442",
		zerolinewidth: 2,
		automargin: true,
	},
	scene: {
		xaxis: {
			backgroundcolor: "rgb(17,17,17)",
			gridcolor: "#506784",
			linecolor: "#506784",
			showbackground: true,
			ticks: "",
			zerolinecolor: "#C8D4E3",
			gridwidth: 2,
		},
		yaxis: {
			backgroundcolor: "rgb(17,17,17)",
			gridcolor: "#506784",
			linecolor: "#506784",
			showbackground: true,
			ticks: "",
			zerolinecolor: "#C8D4E3",
			gridwidth: 2,
		},
		zaxis: {
			backgroundcolor: "rgb(17,17,17)",
			gridcolor: "#506784",
			linecolor: "#506784",
			showbackground: true,
			ticks: "",
			zerolinecolor: "#C8D4E3",
			gridwidth: 2,
		},
	},
	geo: {
		bgcolor: "rgb(17,17,17)",
		landcolor: "rgb(17,17,17)",
		subunitcolor: "#506784",
		showland: true,
		showlakes: true,
		lakecolor: "rgb(17,17,17)",
	},
};
