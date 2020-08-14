# Visualization Framework

## Installation

You can use yarn to install the core library:

```
yarn add @hediet/visualization-core
```

If you want to use the existing visualizations, add the bundle library:

```
yarn add @hediet/visualization-bundle
```

## Usage

Import `@hediet/visualization-bundle` to register all default visualizations:

```tsx
// This registers all visualizations
import "@hediet/visualization-bundle";
```

Don't forget to import the styles in your scss file:

```scss
@import "~@hediet/visualization-bundle/style.scss";
```

Use `globalVisualizationFactory` to visualize some data:

```tsx
import { globalVisualizationFactory } from "@hediet/visualization-core";

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
	/* preferred visualization id */ undefined
);
// `visualizations.bestVisualization` is the visualization that is best suited to visualize the data.
// `visualiztaions.allVisualizations` contains all suitable visualizations.
```

If you use react, you can use the `VisualizationView` component to render a visualization:

```tsx
import { VisualizationView, Theme } from "@hediet/visualization-core";

// const visualizations = ...

function App() {
	if (!visualizations.bestVisualization) {
		return null;
	}
	return (
		<VisualizationView
			theme={Theme.light}
			visualization={visualizations.bestVisualization}
		/>
	);
}
```
