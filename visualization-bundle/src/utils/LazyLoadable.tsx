import * as React from "react";
import { observer } from "mobx-react";
import { Loadable } from "./Loadable";

export function makeLazyLoadable<TProps>(
	selector: () => Promise<React.ComponentClass<TProps>>
): React.ComponentClass<TProps> & { preload(): Promise<void> } {
	const loader = new Loadable(selector);

	@observer
	class MyComponent extends React.Component<TProps> {
		constructor(props: any) {
			super(props);
			loader.load();
		}

		render() {
			if (!loader.result) {
				return <div>Loading...</div>;
			}
			const C = loader.result;
			return <C {...this.props} />;
		}

		static async preload(): Promise<void> {
			await loader.load();
		}
	}

	return MyComponent;
}
