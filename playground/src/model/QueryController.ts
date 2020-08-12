import { autorun } from "mobx";
import { IRef } from "../common/utils";

export class QueryBinding {
	constructor(
		private readonly queryParamName: string,
		private readonly value: IRef<string | undefined>
	) {
		this.loadFromQuery();
		autorun(() => {
			this.updateQuery();
		});
	}

	private loadFromQuery() {
		const val = getQueryParam(this.queryParamName);
		if (val) {
			this.value.set(val);
		}
	}

	private updateQuery() {
		const url = new URL(window.location.href);
		const val = this.value.get();
		if (val !== undefined) {
			url.searchParams.set(this.queryParamName, val);
		} else {
			url.searchParams.delete(this.queryParamName);
		}
		history.replaceState(null, document.title, url.toString());
	}
}

export function getQueryParam(queryParamName: string): string | null {
	const url = new URL(window.location.href);
	const val = url.searchParams.get(queryParamName);
	return val;
}
