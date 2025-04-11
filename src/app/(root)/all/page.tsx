import { Error } from '@/components/error';
import { SitesList } from '@/components/sites-list';
import { getSites } from '@/services/site';
import { CircleX } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AllSitesPage() {
	const sites = await getSites();

	const t = await getTranslations('SitesList');

	if (!sites) {
		return <Error text={t('error.text')} subText={t('error.subText')} Icon={CircleX} color="text-red-500" />;
	}

	if (sites.length === 0) {
		return <Error text={t('error.empty')} subText="" Icon={CircleX} color="text-red-500" />;
	}

	return <SitesList sites={sites} />;
}
