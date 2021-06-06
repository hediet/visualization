export class Theme {
	private static _light: Theme;
	public static get light(): Theme {
		if (!this._light) {
			this._light = new Theme("light", "light");
		}
		return this._light;
	}

	private static _dark: Theme;
	public static get dark(): Theme {
		if (!this._dark) {
			this._dark = new Theme("dark", "dark");
		}
		return this._dark;
	}

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
