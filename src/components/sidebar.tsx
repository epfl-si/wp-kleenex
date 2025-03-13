'use client';
import { useTranslations } from 'next-intl';
import { GalleryVerticalEnd, Globe, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
	const pathname = usePathname();
	const t = useTranslations('Sidebar');

	return (
		<aside className="w-1/6 space-y-2 border-r p-4">
			<nav className="space-y-2 w-full">
				<Link href="/" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50', pathname === '/' && 'text-red-500')}>
					<Globe className="w-6 h-6 inline-block" />
					{t('home')}
				</Link>
				<Link href="/trash" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50', pathname.includes('teams') && 'text-red-500')}>
					<Trash2 className="w-6 h-6 inline-block" />
					{t('trash')}
				</Link>
				<Link href="/all" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2 hover:bg-gray-200 hover:bg-opacity-50', pathname === '/birthdays' && 'text-red-500')}>
					<GalleryVerticalEnd className="w-6 h-6 inline-block" />
					{t('all')}
				</Link>
			</nav>
		</aside>
	);
};
