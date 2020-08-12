import { Refinement } from "@hediet/semantic-json/dist/src/serialization/BaseSerializer";

export function withDeserializer<T, TIntermediate>(
	fromIntermediate: (val: TIntermediate) => T
): Refinement<T, TIntermediate> {
	return {
		canSerialize: (val: unknown): val is T => false,
		fromIntermediate,
		toIntermediate: () => {
			throw new Error("not supported");
		},
	};
}
