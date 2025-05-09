import { auth } from '@/services/auth';
import { createSite } from '@/services/site';
import { wordpressSiteSchema } from '@/types/site';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST(request: Request) {
	const session = await auth();
	if (!session) {
		return NextResponse.json(
			{
				success: false,
				message: 'You must be logged in to create a site.',
			},
			{ status: 401 }
		);
	}

	try {
		const body = await request.json();

		const siteData = {
			title: body.wordpress?.title || body.title,
			tagline: body.wordpress?.tagline || body.tagline,
			theme: body.wordpress?.theme || body.theme,
			languages: body.wordpress?.languages || body.languages,
			type: body.wordpress?.type || body.type,
			expiration: body.wordpress?.expiration || body.expiration,
			debug: body.wordpress?.debug || body.debug,
		};

		const validate = await wordpressSiteSchema.safeParseAsync(siteData);
		if (!validate.success) {
			console.error('Validation error:', validate.error.flatten().fieldErrors);
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid site data.',
					errors: validate.error.flatten().fieldErrors,
				},
				{ status: 400 }
			);
		}

		const id = uuid();
		const hostname = process.env.WEBSITE_HOST || 'wp-kleenex.epfl.ch';

		const result = await createSite({
			wordpress: {
				debug: validate.data.debug,
				theme: validate.data.theme,
				languages: validate.data.languages,
				title: validate.data.title,
				tagline: validate.data.tagline,
				type: validate.data.type,
				plugins: [],
			},
			hostname: hostname,
			path: `/${id}`,
			id: id,
			owner: session.user.employeeId,
			expiration: validate.data.expiration,
			type: validate.data.type,
		});

		if (result.status !== 201) {
			throw new Error(result.message || 'Failed to create site');
		}

		return NextResponse.json({
			success: true,
			message: 'Site created successfully.',
			url: `https://${hostname}/${id}`,
			siteId: id,
		});
	} catch (error) {
		console.error('Error creating site:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

		return NextResponse.json(
			{
				success: false,
				message: `Failed to create site: ${errorMessage}`,
			},
			{ status: 500 }
		);
	}
}
