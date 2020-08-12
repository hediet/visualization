import { Model } from "./Model";
import { Disposable } from "@hediet/std/disposable";
import { autorun } from "mobx";
import { getLoadedMonaco } from "@hediet/monaco-editor-react";

export class MonacoBridge {
	public readonly dispose = Disposable.fn();

	constructor(private readonly model: Model) {
		return;
		this.dispose.track({
			dispose: autorun(() => {
				getLoadedMonaco().editor.setTheme(
					model.theme === "light" ? "vs-light" : "vs-dark"
				);
			}),
		});
	}
}
