'use client';
import React from 'react';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslations } from 'next-intl';
import { Session } from 'next-auth';
import { UserRound } from 'lucide-react';

export const Header: React.FC<{ session: Session }> = ({ session }) => {
	return (
		<header className="text-primary-secondary py-2 px-2 sm:py-4 sm:px-6 flex items-center justify-between border-b-2 border-0 select-none">
			<div className="flex items-center gap-2 sm:gap-4 p-1 sm:p-3">
				<img src="https://epfl-si.github.io/elements/svg/epfl-logo.svg" alt="LOGO" className="h-4 sm:h-7" />
				<span className="border-l-2 border-solid sm:h-6 h-4 w-1 border-gray-300"></span>
				<h1 className="text-base sm:text-2xl font-bold -ml-1 sm:ml-0">WP-Kleenex</h1>
			</div>
			<div className="flex items-center gap-2 sm:gap-8">
				<div className="flex items-center gap-2">
					<UserRound />
					<p className="text-primary-secondary text-sm sm:text-base font-medium">{session.user.name}</p>
				</div>
				<LanguageSelector />
			</div>
		</header>
	);
};
