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
			title: z.string(),
			alias: z.string(),
			description: z.string(),
			gallery: z.array(image()),
			publicProjectUrl: z.object({
				title: z.string(),
				href: z.string(),
			}).optional(),
			date: z.coerce.date(),
			order: z.number().optional(),
			visible: z.boolean().optional().default(true),
			license: z.string().optional().default('CC0 1.0 Universal (Public Domain)'),
			downloads: z.array(z.object({
				format: z.string(),
				href: z.string(),
			})),
		}),
	}),
};
