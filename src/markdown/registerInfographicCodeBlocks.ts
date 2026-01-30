import type InfographicPlugin from "../main";
import { InfographicCodeBlockChild } from "./InfographicCodeBlockChild";

const LANGUAGES = ["infographic"] as const;

export function registerInfographicCodeBlocks(plugin: InfographicPlugin) {
	for (const lang of LANGUAGES) {
		plugin.registerMarkdownCodeBlockProcessor(lang, (source, el, ctx) => {
			const container = el.createDiv({ cls: "infographic-codeblock" });
			ctx.addChild(new InfographicCodeBlockChild(container, source));
		});
	}
}
