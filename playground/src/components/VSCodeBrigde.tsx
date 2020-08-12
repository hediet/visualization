import { observable, autorun, runInAction, toJS, reaction } from "mobx";
import { PlaygroundDocument } from "./PlaygroundDocumentEditor";

export class VSCodeBrigde {
	@observable public currentDocument: PlaygroundDocument = {
		visualizations: [],
	};
	private ignoreChanges = false;

	constructor() {
		window.addEventListener("message", e => {
			const msg = e.data as MessageFromHost;

			if (msg.kind === "loadContent") {
				this.ignoreChanges = true;
				runInAction("Update data", () => {
					this.currentDocument = msg.content as PlaygroundDocument;
				});
				this.ignoreChanges = false;
			}
		});

		reaction(
			() => toJS(this.currentDocument),
			newContent => {
				if (this.ignoreChanges) {
					return;
				}
				this.sendMessage({
					kind: "onChange",
					newContent,
				});
			}
		);

		this.sendMessage({
			kind: "onInit",
		});
	}

	private sendMessage(m: MesssageToHost) {
		window.parent.postMessage(m, "*");
	}
}

type JsonValue = unknown;

type MessageFromHost = {
	kind: "loadContent";
	content: JsonValue;
};

type MesssageToHost =
	| { kind: "onInit" }
	| { kind: "log"; message: string }
	| {
			kind: "onChange";
			newContent: JsonValue;
	  };
