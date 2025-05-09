import { z } from 'zod';
export interface Site {
	hostname: string;
	path: string;
	owner: string;
	creationTimestamp?: string;
	expirationTimestamp?: string;
	id: string;
	expiration: 10800 | 21600 | 43200;
	type: 'basic' | 'blank' | 'formation' | 'copy';
	wordpress: {
		debug: boolean;
		theme: string;
		languages: string[];
		title: string;
		tagline: string;
	};
}

export const wordpressSiteSchema = z.object({
	title: z.string().min(1),
	tagline: z.string().min(1),
	theme: z.enum(['wp-theme-2018', 'wp-theme-light', 'epfl-master', 'epfl-blank']),
	languages: z.array(z.string().regex(/^[a-z]{2}$/)).min(1),
	type: z.enum(['basic', 'blank', 'formation', 'copy']),
	expiration: z.union([z.literal(10800), z.literal(21600), z.literal(43200)]),
	debug: z.boolean(),
});
