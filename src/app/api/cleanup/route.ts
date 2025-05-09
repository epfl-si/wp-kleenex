import { auth } from '@/services/auth';
import { deleteSite, findExpiredSites } from '@/services/site';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	try {
		const session = await auth();
		if (!session || session.user.role !== 'admin') {
			return NextResponse.json(
				{
					success: false,
					message: 'Unauthorized. Only administrators can trigger cleanup.',
				},
				{ status: 401 }
			);
		}

		const authHeader = request.headers.get('x-api-key');
		const configuredApiKey = process.env.CLEANUP_API_KEY;

		if (configuredApiKey && authHeader !== configuredApiKey) {
			return NextResponse.json(
				{
					success: false,
					message: 'Invalid API key',
				},
				{ status: 403 }
			);
		}

		const expiredSiteIds = await findExpiredSites();

		if (expiredSiteIds.length === 0) {
			return NextResponse.json({
				success: true,
				message: 'No expired sites found to clean up',
				deletedCount: 0,
				deleted: [],
			});
		}

		const results = await Promise.allSettled(
			expiredSiteIds.map(async (siteId) => {
				try {
					const result = await deleteSite(siteId);
					return {
						siteId,
						success: result.status === 200,
						message: result.message,
					};
				} catch (error) {
					return {
						siteId,
						success: false,
						message: error instanceof Error ? error.message : 'Unknown error',
					};
				}
			})
		);

		const successful = results.filter((result) => result.status === 'fulfilled' && result.value.success).map((result) => (result as PromiseFulfilledResult<any>).value.siteId);

		const failed = results
			.filter((result) => result.status === 'rejected' || !(result as PromiseFulfilledResult<any>).value.success)
			.map((result) => {
				if (result.status === 'rejected') {
					return { siteId: 'unknown', reason: result.reason };
				} else {
					const value = (result as PromiseFulfilledResult<any>).value;
					return { siteId: value.siteId, reason: value.message };
				}
			});

		return NextResponse.json({
			success: true,
			message: `Successfully cleaned up ${successful.length} of ${expiredSiteIds.length} expired sites`,
			deletedCount: successful.length,
			deleted: successful,
			failed: failed,
		});
	} catch (error) {
		console.error('Error in cleanup process:', error);

		return NextResponse.json(
			{
				success: false,
				message: `Failed to run cleanup process: ${error instanceof Error ? error.message : 'Unknown error'}`,
			},
			{ status: 500 }
		);
	}
}

export async function GET(request: Request) {
	try {
		const session = await auth();
		if (!session) {
			return NextResponse.json(
				{
					success: false,
					message: 'Unauthorized. Please log in to view expired sites.',
				},
				{ status: 401 }
			);
		}

		const expiredSiteIds = await findExpiredSites();

		return NextResponse.json({
			success: true,
			expiredCount: expiredSiteIds.length,
			expiredSites: expiredSiteIds,
		});
	} catch (error) {
		console.error('Error checking expired sites:', error);

		return NextResponse.json(
			{
				success: false,
				message: `Failed to check expired sites: ${error instanceof Error ? error.message : 'Unknown error'}`,
			},
			{ status: 500 }
		);
	}
}
