import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	mods: defineCollection({
		loader: glob({ pattern: '**/*.json', base: './src/content/mods' }),
		schema: ({ image }) => z.object({
			alias: z.string(),
			title: z.string(),
			description: z.string(),
			author: z.object({
				label: z.string(),
				name: z.string(),
				href: z.string(),
			}),
			previewImage: image(),
		}),
	}),
	tools: defineCollection({
		loader: glob({ pattern: '**/*.json', base: './src/content/tools' }),
		schema: ({ image }) => z.object({
			alias: z.string(),
			title: z.string(),
			description: z.string(),
			previewImage: image(),
			publicProjectUrl: z.string().optional(),
			downloads: z.array(z.object({
				format: z.string(),
				href: z.string(),
			})),
		}),
	}),
};
