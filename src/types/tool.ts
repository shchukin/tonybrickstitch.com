import type { ImageMetadata } from 'astro';

export interface ToolDownload {
	format: string;
	href: string;
}

export interface PublicProject {
	title: string;
	href: string;
}

export interface ToolData {
	alias: string;
	title: string;
	description: string;
	gallery: ImageMetadata[];
	publicProjectUrl?: PublicProject;
	date: Date;
	order?: number;
	visible?: boolean;
	license?: string;
	downloads: ToolDownload[];
}
