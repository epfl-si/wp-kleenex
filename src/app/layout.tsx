import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
export const dynamic = 'force-dynamic';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'WP-Kleenex',
	description: 'Best way to find the best fries',
	icons: {
		icon: [
			{
				url: 'https://epfl-si.github.io/elements/svg/epfl-logo.svg',
			},
		],
	},
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} className="h-full">
			<body className={cn('antialiased h-full flex flex-col', inter.className)}>
				<NextIntlClientProvider messages={messages}>
					<Header />
					<div className="flex-grow">{children}</div>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
