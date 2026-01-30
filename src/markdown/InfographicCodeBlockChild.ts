import { Infographic, parseSyntax } from "@antv/infographic";
import { MarkdownRenderChild } from "obsidian";

export class InfographicCodeBlockChild extends MarkdownRenderChild {
	private infographic?: Infographic;
	private readonly source: string;

	constructor(containerEl: HTMLElement, source: string) {
		super(containerEl);
		this.source = source;
	}

	onload() {
		this.render();
	}

	onunload() {
		this.infographic?.destroy();
	}

	private render() {
		this.containerEl.empty();
		this.containerEl.addClass("infographic-codeblock__container");

		if (!this.source.trim()) {
			this.renderError("Empty code block.");
			return;
		}

		const { options, errors } = parseSyntax(this.source);
		if (errors.length > 0) {
			const message = errors
				.slice(0, 5)
				.map((e) => `Line ${e.line}: ${e.message}`)
				.join("\n");
			this.renderError(message);
			return;
		}

		const canvasEl = this.containerEl.createDiv({ cls: "infographic-codeblock__canvas" });

		try {
			this.infographic = new Infographic({
				...options,
				container: canvasEl,
				width: "100%",
				height: "auto",
				editable: false,
			});
			this.infographic.render();
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			this.containerEl.empty();
			this.renderError(message);
		}
	}

	private renderError(message: string) {
		const pre = this.containerEl.createEl("pre", { cls: "infographic-codeblock__error" });
		pre.setText(message);
	}
}
