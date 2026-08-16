import type { ImageMetadata } from 'astro';

export interface ToolDownload {
	format: string;
	href: string;
}

export interface ToolData {
	alias: string;
	title: string;
	description: string;
	gallery: ImageMetadata[];
	publicProjectUrl?: string;
	date: Date;
	order?: number;
	visible?: boolean;
	downloads: ToolDownload[];
}
