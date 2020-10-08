import { observable, runInAction } from "mobx";

export class Loadable<T> {
	@observable.ref
	public result: T | undefined;

	private operation?: Promise<void> = undefined;

	constructor(private readonly _load: () => Promise<T>) {}

	public load(): Promise<void> {
		if (!this.operation) {
			this.operation = (async () => {
				const r = await this._load();
				runInAction(() => {
					this.result = r;
				});
			})();
		}
		return this.operation;
	}
}
