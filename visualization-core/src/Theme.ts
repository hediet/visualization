export class Theme {
	public static readonly light = new Theme("light", "light");
	public static readonly dark = new Theme("dark", "dark");

	private readonly divElement = document.createElement("div");

	constructor(
		public readonly id: string,
		public readonly kind: "light" | "dark"
	) {
		this.divElement.classList.add(
			"themeable",
			`theme-${this.id}`,
			"visualization"
		);
		this.divElement.style.display = "none";
		document.body.append(this.divElement);
	}

	public resolveVarToColor(varName: string): string {
		return getComputedStyle(this.divElement).getPropertyValue(varName);
	}
}
