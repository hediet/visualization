import * as webpack from "webpack";
import path = require("path");
import HtmlWebpackPlugin = require("html-webpack-plugin");
import MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
import ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
import { CleanWebpackPlugin } from "clean-webpack-plugin";

const r = (file: string) => path.resolve(__dirname, file);

module.exports = {
	entry: [r("src/index.tsx")],
	output: {
		path: r("dist"),
		filename: "[name].js",
		chunkFilename: "[name]-[hash].js",
		devtoolModuleFilenameTemplate: info => {
			let result = info.absoluteResourcePath.replace(/\\/g, "/");
			if (!result.startsWith("file:")) {
				// Some paths already start with the file scheme.
				result = "file:///" + result;
			}
			return result;
		},
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.less$/,
				loaders: ["style-loader", "css-loader", "less-loader"],
			},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{ test: /\.scss$/, loader: "style-loader!css-loader!sass-loader" },
			{
				test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2|md)$/i,
				loader: "file-loader",
			},
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: { transpileOnly: true },
			},
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
		],
	},
	node: {
		fs: "empty",
	},
	plugins: (() => {
		const plugins: any[] = [
			new HtmlWebpackPlugin({
				title: "Debug Visualizer",
			}),
			new ForkTsCheckerWebpackPlugin(),
			new CleanWebpackPlugin(),
		];

		plugins.push(
			new MonacoWebpackPlugin({
				languages: ["typescript", "json"],
			})
		);

		return plugins;
	})(),
} as webpack.Configuration;
