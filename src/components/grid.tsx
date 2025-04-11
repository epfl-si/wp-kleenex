'use client';
import React from 'react';
import { Site } from '@/types/site';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const GridView: React.FC<{ sites: Site[] }> = ({ sites }) => (
	<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{sites.map((site, index) => (
			<Card key={site.hostname + index} className="hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
				<CardHeader className="pb-2">
					<CardTitle className="text-lg font-bold text-blue-800">{site.wordpress.title}</CardTitle>
				</CardHeader>
				<CardContent className="flex flex-col flex-grow">
					<p className="text-gray-600 mb-4 line-clamp-2">{site.wordpress.tagline}</p>

					<div className="mb-4">
						{site.wordpress.type && (
							<Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200 mb-2">
								{site.wordpress.type}
							</Badge>
						)}

						<div className="mt-2">
							<p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Langues</p>
							<div className="flex flex-wrap gap-1">
								{site.wordpress.languages.sort().map((lang) => (
									<Badge key={lang} variant="secondary" className="text-xs">
										{lang}
									</Badge>
								))}
							</div>
						</div>
					</div>

					<div className="mt-auto">
						<p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Thème</p>
						<p className="text-sm text-gray-700 mb-2">{site.wordpress.theme}</p>

						<p className="text-xs text-gray-500 mb-1 uppercase font-semibold">Plugins ({site.wordpress.plugins.length})</p>
						<div className="flex flex-wrap gap-1">
							{site.wordpress.plugins.slice(0, 3).map((plugin) => (
								<Badge key={plugin} variant="secondary" className="text-xs">
									{plugin}
								</Badge>
							))}
							{site.wordpress.plugins.length > 3 && (
								<Badge variant="secondary" className="text-xs">
									+{site.wordpress.plugins.length - 3}
								</Badge>
							)}
						</div>

						<div className="flex justify-between items-center mt-4 pt-2 border-t">
							<Button variant="destructive" size="sm">
								<Trash2 className="h-4 w-4 mr-1" />
								Supprimer
							</Button>
							<Button variant="outline" size="sm" asChild>
								<Link href={`https://${site.hostname}${site.path}`} target="_blank" rel="noopener noreferrer">
									<ExternalLink className="h-4 w-4 mr-1" />
									Visiter
								</Link>
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>
		))}
	</div>
);
