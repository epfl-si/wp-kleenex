import { z } from 'zod';

export interface Site {
	hostname: string;
	path: string;
	owner: string;
	creationTimestamp?: string;
	expirationTimestamp?: string;
	id: string;
	expiration: 10800 | 21600 | 43200; // 3, 6, or 12 hours in seconds
	type: 'basic' | 'blank' | 'formation' | 'copy';
	wordpress: {
		debug: boolean;
		theme: string;
		languages: string[];
		title: string;
		tagline: string;
		plugins: string[];
		type?: string;
	};
	status?: 'creating' | 'active' | 'expiring' | 'expired';
}

export const wordpressSiteSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	tagline: z.string().optional().default(''),
	theme: z.enum(['wp-theme-2018', 'wp-theme-light', 'epfl-master', 'epfl-blank'], {
		errorMap: () => ({ message: 'Please select a valid theme' }),
	}),
	languages: z.array(z.string().regex(/^[a-z]{2}$/)).min(1, 'At least one language is required'),
	type: z.enum(['basic', 'blank', 'formation', 'copy'], {
		errorMap: () => ({ message: 'Please select a valid site type' }),
	}),
	expiration: z.union(
		[
			z.literal(10800), // 3 hours
			z.literal(21600), // 6 hours
			z.literal(43200), // 12 hours
		],
		{
			errorMap: () => ({ message: 'Please select a valid expiration time' }),
		}
	),
	debug: z.boolean().default(false),
});

export type SiteFormValues = z.infer<typeof wordpressSiteSchema>;

export interface SiteCreationResponse {
	success: boolean;
	message: string;
	url?: string;
	siteId?: string;
	errors?: Record<string, string[]>;
}

export interface SiteStats {
	total: number;
	active: number;
	expiring: number;
	totalSystemSites?: number;
}
