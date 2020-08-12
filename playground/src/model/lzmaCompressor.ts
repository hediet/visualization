import * as lzma from "lzma/src/lzma_worker";
import * as msgpack from "messagepack";
import * as base64 from "base64-js";

export function encodeData(json: unknown | undefined): string | undefined {
	if (json === undefined) {
		return undefined;
	}
	// normalize undefined
	json = JSON.parse(JSON.stringify(json));
	const data = msgpack.encode(json);
	const compressed = lzma.LZMA.compress(data, 9);
	const compressedStr = base64.fromByteArray(compressed);

	return compressedStr
		.replace(/\+/g, "-") // Convert '+' to '-'
		.replace(/\//g, "_") // Convert '/' to '_'
		.replace(/=+$/, ""); // Remove ending '='
}

export function decodeData(
	compressedStr: string | undefined
): unknown | undefined {
	if (compressedStr === undefined) {
		return undefined;
	}
	compressedStr += Array(5 - (compressedStr.length % 4)).join("=");
	compressedStr = compressedStr
		.replace(/\-/g, "+") // Convert '-' to '+'
		.replace(/\_/g, "/"); // Convert '_' to '/'

	const compressed2 = base64.toByteArray(compressedStr);
	const decompressed = lzma.LZMA.decompress(compressed2);
	const origData = msgpack.decode(new Uint8Array(decompressed));
	return origData;
}
