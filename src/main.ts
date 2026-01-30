import { Plugin } from "obsidian";
import { registerInfographicCodeBlocks } from "./markdown/registerInfographicCodeBlocks";

export default class InfographicPlugin extends Plugin {
	async onload() {
		registerInfographicCodeBlocks(this);
	}

	onunload() {}
}
