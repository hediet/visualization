export type KnownVisualizationData = MonacoTextVisualizationData;


export type MonacoTextVisualizationData = {
	kind: {
		text: true;
	};
	/**
	 * The text to show
	 */
	text: string;
	decorations?: ({
		range: LineColumnRange;
		label?: string;
	})[];
	/**
	 * An array of schemas used to validate JSON documents.
	 */
	jsonSchemas?: ({
		/**
		 * A json schema object that is applied when the fileName indicates a JSON document.
		 */
		schema: any;
	})[];
	/**
	 * An optional filename that might be used for chosing a syntax highlighter
	 */
	fileName?: string;
};

export type LineColumnRange = {
	/**
	 * The start position
	 */
	start: LineColumnPosition;
	/**
	 * The end position
	 */
	end: LineColumnPosition;
};

export type LineColumnPosition = {
	/**
	 * The 0-based line number
	 */
	line: number;
	/**
	 * The 0-based column number
	 */
	column: number;
};

