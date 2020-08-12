export class Theme {
	public static readonly light = new Theme("light", "light");
	public static readonly dark = new Theme("dark", "dark");

	constructor(
		public readonly id: string,
		public readonly kind: "light" | "dark"
	) {}
}
