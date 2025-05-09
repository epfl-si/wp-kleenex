'use client';
import { useTranslations } from 'next-intl';
import { GalleryVerticalEnd, Globe, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';

export const Sidebar: React.FC<{ session: Session }> = ({ session }) => {
	const pathname = usePathname();
	const t = useTranslations('Sidebar');

	return (
		<aside className="w-1/6 space-y-2 border-r p-4">
			<nav className="space-y-2 w-full">
				<Link href="/" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2', pathname === '/' ? 'text-primary font-semibold' : 'hover:bg-muted/80')}>
					<Globe className="w-6 h-6 inline-block" />
					{t('home')}
				</Link>
				<Link href="/new" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2', pathname === '/new' ? 'text-primary font-semibold' : 'hover:bg-muted/80')}>
					<Plus className="w-6 h-6 inline-block" />
					{t('new')}
				</Link>
				{session.user.role === 'admin' && (
					<Link href="/all" className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2', pathname === '/all' ? 'text-primary font-semibold' : 'hover:bg-muted/80')}>
						<GalleryVerticalEnd className="w-6 h-6 inline-block" />
						{t('all')}
					</Link>
				)}
			</nav>
		</aside>
	);
};
