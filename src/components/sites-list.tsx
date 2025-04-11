'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import { Site } from '@/types/site';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { TableView } from './table';
import { LayoutGrid, List } from 'lucide-react';
import { GridView } from './grid';
import { Pagination } from './pagination';

export const SitesList: React.FC<{ sites: Site[] }> = ({ sites }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const t = useTranslations('SitesList');

	useEffect(() => {
		const handleResize = () => {
			const height = window.innerHeight;

			setItemsPerPage(Math.floor((height - 300) / 75));
			if (Math.ceil(sites.length / itemsPerPage) < currentPage) {
				setCurrentPage(1);
			}
		};

		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentSites = sites.slice(indexOfFirstItem, indexOfLastItem);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	return (
		<div className="w-full flex flex-col h-full">
			<div className="flex-grow overflow-hidden">
				<div className="p-6">
					<div className="w-full">
						<h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>

						<div className="overflow-x-auto bg-white mt-6 mb-16">
							<TableView sites={currentSites} />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-white shadow-md z-10 p-6 px-9">
				<Pagination itemsPerPage={itemsPerPage} totalItems={sites.length} currentPage={currentPage} paginate={paginate} />
			</div>
		</div>
	);
};
