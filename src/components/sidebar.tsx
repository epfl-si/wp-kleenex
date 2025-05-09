'use client';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, PlusCircle, Trash2, GalleryVerticalEnd, HelpCircle, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Session } from 'next-auth';

interface SidebarProps {
	session: Session;
}

export const Sidebar: React.FC<SidebarProps> = ({ session }) => {
	const pathname = usePathname();
	const t = useTranslations('Sidebar');

	const navItems = [
		{
			href: '/',
			label: t('home'),
			icon: LayoutDashboard,
			showFor: 'all',
		},
		{
			href: '/new',
			label: t('new'),
			icon: PlusCircle,
			showFor: 'all',
		},
		{
			href: '/all',
			label: t('all'),
			icon: GalleryVerticalEnd,
			showFor: 'admin',
		},
		{
			href: '/trash',
			label: t('trash'),
			icon: Trash2,
			showFor: 'all',
		},
		{
			href: '/settings',
			label: t('settings'),
			icon: Settings,
			showFor: 'all',
		},
		{
			href: '/help',
			label: t('help'),
			icon: HelpCircle,
			showFor: 'all',
		},
	];

	const filteredNavItems = navItems.filter((item) => {
		if (item.showFor === 'all') return true;
		if (item.showFor === 'admin' && session.user.role === 'admin') return true;
		if (item.showFor === 'user' && session.user.role !== 'admin') return true;
		return false;
	});

	return (
		<aside className="max-w-72 flex-1 space-y-2 border-r p-4">
			<nav className="space-y-2 w-full">
				{filteredNavItems.map((item) => (
					<Link key={item.href} href={item.href} className={cn('px-6 py-3 rounded-lg flex text-primary-secondary font-medium w-full items-center justify-start gap-2', pathname === item.href ? 'text-primary font-semibold' : 'hover:bg-muted/80')}>
						<item.icon className="w-5 h-5" />
						{item.label}
					</Link>
				))}
			</nav>
		</aside>
	);
};
