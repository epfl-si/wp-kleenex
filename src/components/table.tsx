'use client';
import React from 'react';
import { Site } from '@/types/site';
import { Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export const TableView: React.FC<{ sites: Site[] }> = ({ sites }) => (
	<table className="min-w-full divide-y ">
		<thead className="">
			<tr>
				<th scope="col" className="px-6 py-3 w-1/6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Titre
				</th>
				<th scope="col" className="px-6 py-3 w-1/4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Description
				</th>
				<th scope="col" className="px-6 py-3 w-8 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Type
				</th>
				<th scope="col" className="px-6 py-3 w-30 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Langues
				</th>
				<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Plugins
				</th>
				<th scope="col" className="px-6 py-3 w-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
					Actions
				</th>
			</tr>
		</thead>
		<tbody className="bg-white divide-y ">
			{sites.map((site, index) => (
				<tr key={site.hostname + index} className="hover:bg-gray-50 transition-colors duration-150">
					<td className="px-6 py-4 whitespace-nowrap">
						<div className="text-sm font-medium text-gray-900 w-full truncate">{site.wordpress.title}</div>
					</td>
					<td className="px-6 py-4">
						<div className="text-sm text-gray-500 max-w-xs truncate">{site.wordpress.tagline}</div>
					</td>
					<td className="px-6 py-4 whitespace-nowrap">
						{site.wordpress.type && (
							<Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
								{site.wordpress.type}
							</Badge>
						)}
					</td>
					<td className="px-6 py-4 whitespace-nowrap">
						<div className="flex flex-wrap gap-1">
							{site.wordpress.languages.sort().map((lang) => (
								<Badge key={lang} variant="secondary" className="text-xs">
									{lang}
								</Badge>
							))}
						</div>
					</td>
					<td className="px-6 py-4 whitespace-nowrap">
						<div className="text-sm text-gray-500 flex flex-wrap gap-1">
							{Object.keys(site.wordpress.plugins)
								.sort()
								.map((plugin) => (
									<Badge key={plugin} variant="secondary" className="text-xs">
										{plugin}
									</Badge>
								))}
						</div>
					</td>
					<td className="px-6 py-4 flex gap-2 justify-start items-center">
						<Button variant="destructive" className="cursor-pointer p-3">
							<Trash2 className="h-4 w-4" />
						</Button>
						<Button variant="outline" asChild>
							<Link href={`https://${site.hostname}${site.path}`} target="_blank" rel="noopener noreferrer">
								<ExternalLink className="h-4 w-4" />
							</Link>
						</Button>
					</td>
				</tr>
			))}
		</tbody>
	</table>
);
