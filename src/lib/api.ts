import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const customObjectsApi = kc.makeApiClient(k8s.CustomObjectsApi);

async function getNamespace(): Promise<string> {
	try {
		if (process.env.K8S_NAMESPACE) {
			return process.env.K8S_NAMESPACE;
		}

		const contextNamespace = kc.getContextObject(kc.currentContext)?.namespace;
		if (contextNamespace) {
			return contextNamespace;
		}
	} catch (error) {
		console.warn('Could not auto-detect namespace:', error);
	}

	return 'default';
}

export { k8sApi, customObjectsApi, getNamespace };
