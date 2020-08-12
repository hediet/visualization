# Visualization Bundle

You can use yarn to install this library:

```
yarn add @hediet/visualization-bundle
```

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

See docs of `@hediet/visualization-core` for how to find and render visualizations!

## Supported Visualizations

### Origin Visualizations

-   Tree Visualizer
-   AST Visualizer (+ Monaco Source Code View)
-   Grid Visualizer
-   SVG Visualizer
-   Image Visualizer
-   Simple Text Visualizer

### Integrated Visualizations

-   Plotly Visualizer
-   Perspective JS Visualizer
-   VisJS Visualizer
-   Graphviz Graph Visualizer
-   Graphviz Dot Visualizer
-   Vis.js Visualizer
-   Monaco Editor Source Code Visualizer
