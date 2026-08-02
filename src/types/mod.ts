export interface ModAuthor {
	label: string;
	name: string;
	href: string;
}

export interface ModData {
	alias: string;
	title: string;
	description: string;
	author: ModAuthor;
}
