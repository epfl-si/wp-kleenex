export interface Site {
	hostname: string;
	path: string;
	owner: {
		epfl: {
			userId: string;
		};
	};
	wordpress: {
		debug: boolean;
		plugins: string[];
		theme: string;
		languages: string[];
		title: string;
		tagline: string;
		type?: 'basic' | 'blank' | 'formation' | 'copy';
	};
}
