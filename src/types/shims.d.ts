declare module "csstype" {
	// Minimal shim to satisfy dependencies used by @antv/infographic.
	// We don't rely on these types directly inside this plugin.
	export interface Properties {
		[key: string]: string | number | undefined;
	}
}

declare module "d3" {
	// Minimal shim to satisfy dependencies used by @antv/infographic.
	// We don't rely on these types directly inside this plugin.
	export type PieArcDatum<T> = {
		data?: T;
	} & Record<string, unknown>;

	export type SimulationNodeDatum = Record<string, unknown>;

	export interface SimulationLinkDatum<NodeDatum> extends Record<string, unknown> {
		source: NodeDatum | string | number;
		target: NodeDatum | string | number;
	}
}

