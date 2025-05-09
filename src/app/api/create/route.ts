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
	const body = await request.json();

	console.log('body', body);

	const validate = await wordpressSiteSchema.safeParseAsync(body);
	if (!validate.success) {
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

	await createSite({
		wordpress: {
			debug: validate.data.debug,
			theme: validate.data.theme,
			languages: validate.data.languages,
			title: validate.data.title,
			tagline: validate.data.tagline,
		},
		type: validate.data.type,
		hostname: process.env.WEBSITE_HOST || 'wp-kleenex.epfl.ch',
		path: `/${id}`,
		id: id,
		owner: session.user.employeeId,
		expiration: validate.data.expiration,
	});
	return NextResponse.json({
		success: true,
		message: 'Site created successfully.',
		url: `https://${process.env.WEBSITE_HOST || 'wp-kleenex.epfl.ch'}/${id}`,
	});
}
