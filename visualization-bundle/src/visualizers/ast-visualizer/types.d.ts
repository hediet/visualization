declare module "line-column" {
	export = function(
		text: string
	): {
		fromIndex(
			idx: number
		): {
			line: number;
			col: number;
		};
		toIndex(line: number, column: number): number;
	} {};
}
