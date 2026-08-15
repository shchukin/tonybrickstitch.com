import type { ImageMetadata } from 'astro';

export interface ToolDownload {
	format: string;
	href: string;
}

export interface ToolData {
	alias: string;
	title: string;
	description: string;
	previewImage: ImageMetadata;
	publicProjectUrl?: string;
	downloads: ToolDownload[];
}
