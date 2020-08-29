# Visualization Bundle

This package registers various visualizations. If you have an idea for a cool visualization, add it here!

## Installation

You can use yarn to install this library:

```
yarn add @hediet/visualization-bundle
```

Install `@hediet/visualization-core` before!

## Usage

Import `@hediet/visualization-bundle` to register all default visualizations to `globalVisualizationFactory` of `@hediet/visualization-core`:

```tsx
// This registers all visualizations
import "@hediet/visualization-bundle";
```

Don't forget to import the styles in your scss file:

```scss
@import "~@hediet/visualization-bundle/style.scss";
```

You will need to configure webpack

-   to compile scss files:

```js
{ test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
```

-   to compile less files:

```js
{ test: /\.less$/, loaders: ["style-loader", "css-loader", "less-loader"] }
```

-   to register monaco workers

```js
plugins: [
	// ...
	new MonacoWebpackPlugin({
		languages: ["typescript", "json"],
	}),
];
```

See docs of `@hediet/visualization-core` for how to find and render visualizations!

## Supported Visualizations

You can find a playground that demonstrates all visualizations [here](https://hediet.github.io/visualization/).

### Source Visualizations

-   Tree Visualizer
-   AST Visualizer (+ Monaco Source Code View)
-   Grid Visualizer
-   SVG Visualizer
-   Image Visualizer
-   Simple Text Visualizer

### Integrated Visualization Libraries

-   Plotly Visualizer
-   Perspective JS Visualizer
-   VisJS Visualizer
-   Graphviz Graph Visualizer
-   Graphviz Dot Visualizer
-   Vis.js Visualizer
-   Monaco Editor Source Code Visualizer

## Setup Local Development Copy

-   Clone this repository.
-   Run `yarn` in the root folder.
-   Run `yarn dev` in the `visualization-bundle` folder to start tsc in watch mode.
-   Edit [./playground/src/visualization.ts](../playground/src/visualizations.ts) to your needs to improve webpack performance.
-   Run `yarn dev` in the `playground` folder to start the playground where you can debug your visualization.

Please use the [`simple-text-visualizer`](./src/visualizers/simple-text-visualizer/index.tsx) as starting point!
