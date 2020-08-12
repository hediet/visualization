import * as React from "react";
import { HTMLSelect } from "@blueprintjs/core";

export class Select<T> extends React.Component<{
	options: T[];
	idSelector: (value: T) => string;
	labelSelector: (value: T) => string;
	selected: T | undefined;
	onSelect: (selected: T) => void;
	style: React.CSSProperties;
}> {
	render() {
		const {
			idSelector,
			labelSelector,
			onSelect,
			options,
			selected,
			style,
		} = this.props;
		const ops = options.map(o => ({
			value: idSelector(o),
			label: labelSelector(o),
		}));
		let value: string;
		if (selected === undefined) {
			value = "undefined";
			ops.unshift({ value: "undefined", label: "(Nothing)" });
		} else {
			value = idSelector(selected);
		}

		return (
			<HTMLSelect
				style={style}
				options={ops}
				value={value}
				onChange={e => {
					const selected = options.find(
						o => idSelector(o) === e.currentTarget.value
					);
					if (selected) {
						onSelect(selected);
					}
				}}
			/>
		);
	}
}
