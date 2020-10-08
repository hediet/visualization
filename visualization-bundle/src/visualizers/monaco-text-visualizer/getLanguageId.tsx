import { getLoadedMonaco } from "@hediet/monaco-editor-react";

export function getLanguageId(fileName: string): string {
	const l = getLoadedMonaco().languages.getLanguages();
	const result = l.find(l => {
		if (l.filenamePatterns) {
			for (const p of l.filenamePatterns) {
				if (new RegExp(p).test(fileName)) {
					return true;
				}
			}
		}
		if (l.extensions) {
			for (const p of l.extensions) {
				if (fileName.endsWith(p)) {
					return true;
				}
			}
		}

		return false;
	});

	if (result) {
		return result.id;
	}
	return "text";
}
