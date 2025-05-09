import { customObjectsApi, getNamespace } from '@/lib/api';
import { APIError } from '@/types/error';
import { Site } from '@/types/site';
import { auth } from './auth';

export async function createSite(site: Site): Promise<APIError> {
	try {
		const session = await auth();
		if (!session) {
			return { status: 401, message: 'Unauthorized' };
		}

		const namespace = await getNamespace();

		const k8sSite = {
			apiVersion: 'wordpress.epfl.ch/v2',
			kind: 'WordpressSite',
			metadata: {
				name: `wp-kleenex-${site.id}`,
				namespace: namespace,
				labels: {
					'app.kubernetes.io/managed-by': 'wp-kleenex',
				},
				annotations: {
					'wp-kleenex.epfl.ch/owner': site.owner,
					'wp-kleenex.epfl.ch/type': site.type,
					'wp-kleenex.epfl.ch/expiration': site.expiration.toString(),
				},
			},
			spec: {
				hostname: site.hostname,
				path: site.path,
				wordpress: {
					title: site.wordpress.title,
					tagline: site.wordpress.tagline,
					theme: site.wordpress.theme,
					languages: site.wordpress.languages,
					debug: site.wordpress.debug,
					plugins: {},
				},
			},
		};

		await customObjectsApi.createNamespacedCustomObject({
			group: 'wordpress.epfl.ch',
			version: 'v2',
			namespace,
			plural: 'wordpresssites',
			body: k8sSite,
		});

		return { status: 201, message: 'Created' };
	} catch (error) {
		console.error('Error creating site:', error);
		return {
			status: 500,
			message: error instanceof Error ? error.message : 'Internal Server Error',
		};
	}
}

export async function getSites(): Promise<Site[] | null> {
	try {
		const session = await auth();
		if (!session) {
			return null;
		}

		const namespace = await getNamespace();

		const response: any = await customObjectsApi.listNamespacedCustomObject({
			group: 'wordpress.epfl.ch',
			version: 'v2',
			namespace,
			plural: 'wordpresssites',
		});

		if (!response?.items) {
			return [];
		}

		return response.items
			.filter((item: any) => item.metadata?.labels && item.metadata.labels['app.kubernetes.io/managed-by'] === 'wp-kleenex')
			.map((item: any) => ({
				id: item.metadata.name.replace('wp-kleenex-', ''),
				hostname: item.spec.hostname,
				path: item.spec.path,
				owner: item.metadata.annotations['wp-kleenex.epfl.ch/owner'],
				expiration: parseInt(item.metadata.annotations['wp-kleenex.epfl.ch/expiration']),
				creationTimestamp: new Date(item.metadata.creationTimestamp),
				expirationTimestamp: new Date(new Date(item.metadata.creationTimestamp).getTime() + parseInt(item.metadata.annotations['wp-kleenex.epfl.ch/expiration']) * 1000),
				type: item.metadata.annotations['wp-kleenex.epfl.ch/type'],
				wordpress: {
					title: item.spec.wordpress.title,
					tagline: item.spec.wordpress.tagline,
					theme: item.spec.wordpress.theme,
					languages: item.spec.wordpress.languages,
					debug: item.spec.wordpress.debug,
					plugins: item.spec.wordpress.plugins || [],
					type: item.metadata.annotations['wp-kleenex.epfl.ch/type'],
				},
			}));
	} catch (error) {
		console.error('Error getting sites:', error);
		return null;
	}
}

export async function getUserSites(): Promise<Site[] | null> {
	try {
		const session = await auth();
		if (!session) {
			return null;
		}

		const allSites = await getSites();
		if (!allSites) {
			return null;
		}

		return allSites.filter((site) => site.owner === session.user.employeeId);
	} catch (error) {
		console.error('Error getting user sites:', error);
		return null;
	}
}

export async function deleteSite(siteId: string): Promise<APIError> {
	try {
		const session = await auth();
		if (!session) {
			return { status: 401, message: 'Unauthorized' };
		}

		const namespace = await getNamespace();

		if (session.user.role !== 'admin') {
			const sites = await getUserSites();
			const siteToDelete = sites?.find((site) => site.id === siteId);

			if (!siteToDelete) {
				return { status: 403, message: 'You are not authorized to delete this site' };
			}
		}

		await customObjectsApi.deleteNamespacedCustomObject({
			group: 'wordpress.epfl.ch',
			version: 'v2',
			namespace,
			plural: 'wordpresssites',
			name: `wp-kleenex-${siteId}`,
		});

		return { status: 200, message: 'Deleted' };
	} catch (error) {
		console.error('Error deleting site:', error);
		return {
			status: 500,
			message: error instanceof Error ? error.message : 'Internal Server Error',
		};
	}
}
	} catch (error) {
		console.error('Error getting sites', error);
		return null;
	}
}
