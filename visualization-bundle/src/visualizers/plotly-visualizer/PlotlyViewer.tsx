import { observer } from "mobx-react";
import * as React from "react";
import Plot from "react-plotly.js";

@observer
export class PlotlyViewer extends React.Component<{
	data: Plotly.Data[];
	layout?: Partial<Plotly.Layout>;
	theme: "light" | "dark";
}> {
	render() {
		const { theme, data, layout } = this.props;
		return (
			<Plot
				style={{ width: "100%", height: "100%" }}
				data={data}
				layout={Object.assign(
					{},
					theme === "dark" ? darkLayout : {},
					layout || {}
				)}
				config={{ responsive: true }}
			/>
		);
	}
}

// extracted from the plotly website
const darkLayout: Partial<Plotly.Layout> = {
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
	//margin: { b: 0, t: 0, pad: 0 },
	//height: 300,
	/*colorscale: {
		sequential: [
			[0, "#0508b8"],
			[0.0893854748603352, "#1910d8"],
			[0.1787709497206704, "#3c19f0"],
			[0.2681564245810056, "#6b1cfb"],
			[0.3575418994413408, "#981cfd"],
			[0.44692737430167595, "#bf1cfd"],
			[0.5363128491620112, "#dd2bfd"],
			[0.6256983240223464, "#f246fe"],
			[0.7150837988826816, "#fc67fd"],
			[0.8044692737430168, "#fe88fc"],
			[0.8938547486033519, "#fea5fd"],
			[0.9832402234636871, "#febefe"],
			[1, "#fec3fe"],
		],
		sequentialminus: [
			[0, "#0508b8"],
			[0.0893854748603352, "#1910d8"],
			[0.1787709497206704, "#3c19f0"],
			[0.2681564245810056, "#6b1cfb"],
			[0.3575418994413408, "#981cfd"],
			[0.44692737430167595, "#bf1cfd"],
			[0.5363128491620112, "#dd2bfd"],
			[0.6256983240223464, "#f246fe"],
			[0.7150837988826816, "#fc67fd"],
			[0.8044692737430168, "#fe88fc"],
			[0.8938547486033519, "#fea5fd"],
			[0.9832402234636871, "#febefe"],
			[1, "#fec3fe"],
		],
		diverging: [
			[0, "#8e0152"],
			[0.1, "#c51b7d"],
			[0.2, "#de77ae"],
			[0.3, "#f1b6da"],
			[0.4, "#fde0ef"],
			[0.5, "#f7f7f7"],
			[0.6, "#e6f5d0"],
			[0.7, "#b8e186"],
			[0.8, "#7fbc41"],
			[0.9, "#4d9221"],
			[1, "#276419"],
		],
	},*/
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
	/*
	shapedefaults: {
		fillcolor: "#f2f5fa",
		line: { width: 0 },
		opacity: 0.4,
	},
	annotationdefaults: {
		arrowcolor: "#f2f5fa",
		arrowhead: 0,
		arrowwidth: 1,
	},*/
	geo: {
		bgcolor: "rgb(17,17,17)",
		landcolor: "rgb(17,17,17)",
		subunitcolor: "#506784",
		showland: true,
		showlakes: true,
		lakecolor: "rgb(17,17,17)",
	},
	/*
	updatemenudefaults: { bgcolor: "#506784", borderwidth: 0 },
	sliderdefaults: {
		bgcolor: "#C8D4E3",
		borderwidth: 1,
		bordercolor: "rgb(17,17,17)",
		tickwidth: 0,
	},
	*/
};
