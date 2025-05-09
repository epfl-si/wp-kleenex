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
		if (!session || !session.user.role || session.user.role !== 'admin') {
			return null;
		}

		const namespace = await getNamespace();

		const response: any = await customObjectsApi.listNamespacedCustomObject({
			group: 'wordpress.epfl.ch',
			version: 'v2',
			namespace: namespace,
			plural: 'wordpresssites',
		});

		return response?.items.map((site: any) => site.spec) ?? null;
	} catch (error) {
		console.error('Error getting sites', error);
		return null;
	}
}
