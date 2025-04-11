'use server';
import { ReactNode } from 'react';
import React from 'react';
import { Header } from '@/components/header';
import { redirect } from 'next/navigation';
import { auth } from '@/services/auth';
import { Sidebar } from '@/components/sidebar';

export default async function RootLayout({ children }: { children: ReactNode }) {
	const session = await auth();
	if (!session) {
		redirect('/login');
	}

	return (
		<>
			<Header session={session} />
			<main className="flex sm:h-[calc(100%-90px)]">
				<Sidebar session={session} />
				{children}
			</main>
		</>
	);
}
