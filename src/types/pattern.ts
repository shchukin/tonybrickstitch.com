import type { ImageMetadata } from 'astro';

export interface PatternAuthor {
	label: string;
	name: string;
	href: string;
}

export interface PatternData {
	alias: string;
	title: string;
	description: string;
	author?: PatternAuthor;
	downloadLabel?: string;
	previewImage: ImageMetadata;
}
