import * as React from "react";
import { Table } from "@finos/perspective";
import "@finos/perspective-viewer";
import "@finos/perspective-viewer-datagrid";
import "@finos/perspective-viewer-d3fc";
import "@finos/perspective-viewer/themes/all-themes.css";
import { HTMLPerspectiveViewerElement } from "@finos/perspective-viewer";
import { observer } from "mobx-react";
import { computed, observable } from "mobx";

@observer
export class PerspectiveDataViewer extends React.Component<
	{ data: object[] } & React.HTMLAttributes<HTMLDivElement>
> {
	private readonly nodeRef = React.createRef<HTMLPerspectiveViewerElement>();

	@observable key = 0;

	private oldSchemaStr: string | undefined;

	private async replaceData() {
		const elem = this.nodeRef.current!;
		const data = this.props.data;
		const table = (elem as any).worker.table(data) as Table;

		const newSchema = await table.schema();
		const newSchemaStr = JSON.stringify(newSchema);
		const oldSchemaStr = this.oldSchemaStr;
		this.oldSchemaStr = newSchemaStr;

		if (oldSchemaStr && oldSchemaStr !== newSchemaStr) {
			// perspective js does not like it if new data arrives that has a different schema.
			// We check if the schema changed an remount the component if it did.
			this.key++;
		} else {
			await elem.load(data);
		}

		if (!(elem as any)._show_config) {
			elem.toggleConfig();
		}
	}

	componentDidUpdate() {
		this.replaceData();
	}

	componentDidMount() {
		this.replaceData();
	}

	render() {
		return (
			<perspective-viewer
				key={this.key}
				class={this.props.className}
				style={this.props.style}
				ref={this.nodeRef}
			/>
		);
	}
}
