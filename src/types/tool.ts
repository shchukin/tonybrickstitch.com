import type { ImageMetadata } from 'astro';

export interface ToolDownload {
	format: string;
	href: string;
}

export interface ToolLicense {
	title: string;
	href: string;
}

export interface ToolData {
	title: string;
	alias: string;
	description: string;
	gallery: ImageMetadata[];
	date: Date;
	order?: number;
	visible?: boolean;
	license?: ToolLicense;
	downloadLayout?: 'buttons' | 'list';
	downloads: ToolDownload[];
	downloadFiles?: ToolDownload[];
}
