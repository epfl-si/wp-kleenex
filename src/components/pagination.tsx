'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface PaginationProps {
	itemsPerPage: number;
	totalItems: number;
	currentPage: number;
	paginate: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	return (
		<div className="flex items-center justify-end">
			<div className="flex items-center">
				<span className="text-sm text-gray-700 mr-4">
					Page {currentPage} sur {totalPages}
				</span>
				<div className="flex space-x-2">
					<Button variant="outline" size="icon" onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
};
