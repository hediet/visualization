import { Disposable } from "@hediet/std/disposable";
import { observable } from "mobx";
import { wait } from "@hediet/std/timer";

export function ref<T, TKey extends keyof T & string>(
	obj: T,
	key: TKey
): Ref<T[TKey]> {
	return new Ref(
		() => obj[key],
		v => (obj[key] = v)
	);
}

export interface IRef<T> {
	get: () => T;
	set: (value: T) => void;
}

export class Ref<T> implements IRef<T> {
	constructor(
		public readonly get: () => T,
		public readonly set: (value: T) => void
	) {}

	public map<TNew>(to: (t: T) => TNew, from: (tNew: TNew) => T): Ref<TNew> {
		return new Ref(
			() => to(this.get()),
			val => this.set(from(val))
		);
	}
}

export class Animator {
	public readonly dispose = Disposable.fn();

	@observable public index: number = 0;

	constructor(private readonly times: number[]) {
		if (times.length > 1) {
			this.run();
		}
	}

	private async run() {
		let index = 0;
		while (true) {
			await wait(this.times[index]);
			index = (index + 1) % this.times.length;
			this.index = index;
		}
	}
}
