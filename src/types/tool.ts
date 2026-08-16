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
	title: string;
	alias: string;
	description: string;
	gallery: ImageMetadata[];
	publicProjectUrl?: PublicProject;
	date: Date;
	order?: number;
	visible?: boolean;
	license?: string;
	downloadLayout?: 'buttons' | 'list';
	downloads: ToolDownload[];
}
