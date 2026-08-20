import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const collections = {
	patterns: defineCollection({
		loader: glob({ pattern: '**/*.json', base: './src/content/patterns' }),
		schema: ({ image }) => z.object({
			alias: z.string(),
			title: z.string(),
			description: z.string(),
			author: z.object({
				label: z.string(),
				name: z.string(),
				href: z.string(),
			}).optional(),
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
			date: z.coerce.date(),
			order: z.number().optional(),
			visible: z.boolean().optional().default(true),
			license: z.object({
				title: z.string(),
				href: z.string(),
			}).optional().default({
				title: 'CC0 1.0 Universal (Public Domain)',
				href: 'https://creativecommons.org/publicdomain/zero/1.0/',
			}),
			downloadLayout: z.enum(['buttons', 'list']).optional().default('buttons'),
			downloads: z.array(z.object({
				format: z.string(),
				href: z.string(),
			})),
			downloadFiles: z.array(z.object({
				format: z.string(),
				href: z.string(),
			})).optional(),
		}),
	}),
};
