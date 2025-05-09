// src/app/api/stats/route.ts
import { auth } from '@/services/auth';
import { getSiteStats, getUserSites } from '@/services/site';
import { NextResponse } from 'next/server';

/**
 * API endpoint to get statistics about WordPress sites
 */
export async function GET(request: Request) {
	try {
		// Validate if the request is authorized
		const session = await auth();
		if (!session) {
			return NextResponse.json(
				{
					success: false,
					message: 'Unauthorized. Please log in to view site statistics.',
				},
				{ status: 401 }
			);
		}

		// Get overall site statistics
		const stats = await getSiteStats();

		// Get user-specific statistics if they're not an admin
		if (session.user.role !== 'admin') {
			const userSites = await getUserSites();

			if (userSites) {
				const now = new Date();
				const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

				const userStats = {
					total: userSites.length,
					active: userSites.filter((site) => new Date(site.expirationTimestamp || '') > now).length,
					expiring: userSites.filter((site) => {
						const expirationDate = new Date(site.expirationTimestamp || '');
						return expirationDate > now && expirationDate <= twentyFourHoursFromNow;
					}).length,
				};

				return NextResponse.json({
					success: true,
					...userStats,
					totalSystemSites: stats?.total || 0,
				});
			}
		}

		// Return the overall statistics for admins
		return NextResponse.json({
			success: true,
			...stats,
		});
	} catch (error) {
		console.error('Error fetching site statistics:', error);

		return NextResponse.json(
			{
				success: false,
				message: `Failed to fetch site statistics: ${error instanceof Error ? error.message : 'Unknown error'}`,
			},
			{ status: 500 }
		);
	}
}
