//// Uncomment the visualization that you work on to increase webpack build speed!
//// If you create a new visualization, add it here!

// import "@hediet/visualization-bundle/dist/visualizers/ast-visualizer"; /*
// import "@hediet/visualization-bundle/dist/visualizers/graph/dot-graphviz-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/graph/graph-graphviz-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/graph/graph-visjs-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/grid-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/image-visualizer"; /*
// import "@hediet/visualization-bundle/dist/visualizers/monaco-text-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/monaco-text-diff-visualizer"; /*
// import "@hediet/visualization-bundle/dist/visualizers/perspective-table-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/plotly-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/simple-text-visualizer"; /*
// import "@hediet/visualization-bundle/dist/visualizers/source-visualizer"; /*
// import "@hediet/visualization-bundle/dist/visualizers/svg-visualizer" /*
// import "@hediet/visualization-bundle/dist/visualizers/tree-visualizer"; /*

// This bundles the monaco editor. Uncomment it to load monaco dynamically.
// Dynamic loading increases webpack build speed significantly.
if (typeof process === undefined) {
	// We check for process so that we don't load monaco from nodejs.
	require("monaco-editor");
}

// This import bundles *all* visualizations. This makes webpack super slow.
import "@hediet/visualization-bundle"; // */
