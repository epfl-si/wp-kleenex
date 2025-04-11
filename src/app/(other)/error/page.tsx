'use server';

import { Error } from '@/components/error';
import { CircleX } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function ErrorPage({ searchParams }: { searchParams: { type?: string } }) {
	const t = await getTranslations('Error');
	const { type = 'serverError' } = (await searchParams) || {};

	const errorType = ['unauthorized', 'serverError'].includes(type.toLowerCase()) ? type.toLowerCase() : 'serverError';

	return <Error text={t(`${errorType}.text`)} subText={t(`${errorType}.subText`)} Icon={CircleX} color="text-red-500" />;
}
