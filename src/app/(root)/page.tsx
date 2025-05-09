'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Layers, Clock, Info } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
	const t = useTranslations('Home');
	const [siteStats, setSiteStats] = useState({
		active: 0,
		expiring: 0,
		total: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const response = await fetch('/api/stats');
				if (response.ok) {
					const data = await response.json();
					setSiteStats({
						active: data.active || 0,
						expiring: data.expiring || 0,
						total: data.total || 0,
					});
				}
			} catch (error) {
				console.error('Failed to fetch site statistics', error);
			}
		};

		fetchStats();
	}, []);

	return (
		<div className="flex-1 p-6 overflow-auto">
			<div className="">
				<section className="mb-12">
					<h1 className="text-3xl font-bold mb-2">{t('welcome')}</h1>
					<p className="text-lg text-gray-600">{t('description')}</p>
				</section>

				<section className="mb-12">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-2xl font-bold flex items-center">
									<PlusCircle className="mr-2 h-6 w-6 text-blue-500" />
									{t('quickCreate')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600">{t('quickCreateDesc')}</p>
								<Button asChild className="w-full">
									<Link href="/new">{t('createButton')}</Link>
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-2xl font-bold flex items-center">
									<Layers className="mr-2 h-6 w-6 text-green-500" />
									{t('activeSites')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-4xl font-bold text-center mb-2">{siteStats.active}</p>
								<p className="text-gray-600 text-center">{t('activeSitesDesc')}</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-2xl font-bold flex items-center">
									<Clock className="mr-2 h-6 w-6 text-yellow-500" />
									{t('expiringSoon')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-4xl font-bold text-center mb-2">{siteStats.expiring}</p>
								<p className="text-gray-600 text-center">{t('expiringSoonDesc')}</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-2xl font-bold flex items-center">
									<Info className="mr-2 h-6 w-6 text-purple-500" />
									{t('siteInfo')}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="mb-4 text-gray-600">{t('siteInfoDesc')}</p>
								<Button variant="outline" asChild className="w-full">
									<Link href="/docs">{t('learnMoreButton')}</Link>
								</Button>
							</CardContent>
						</Card>
					</div>
				</section>

				<section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
					<h2 className="text-xl font-semibold mb-3">{t('helpTitle')}</h2>
					<p className="mb-4">{t('helpDesc')}</p>
					<div className="flex flex-wrap gap-4">
						<Button variant="outline" asChild>
							<a href="https://www.epfl.ch/campus/services/websites/contact/" target="_blank" rel="noopener noreferrer">
								{t('contactSupport')}
							</a>
						</Button>
						<Button variant="outline" asChild>
							<a href="https://www.epfl.ch/campus/services/websites/wordpress/" target="_blank" rel="noopener noreferrer">
								{t('wordpressGuide')}
							</a>
						</Button>
					</div>
				</section>
			</div>
		</div>
	);
}
