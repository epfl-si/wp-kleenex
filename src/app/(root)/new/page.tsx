'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { wordpressSiteSchema } from '@/types/site';

type FormValues = z.infer<typeof wordpressSiteSchema>;

type SubmissionResult = {
	success: boolean;
	message: string;
	url?: string;
};

export default function NewWordpressSite() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

	const t = useTranslations('NewSite');

	const form = useForm<FormValues>({
		resolver: zodResolver(wordpressSiteSchema),
		defaultValues: {
			title: '',
			tagline: '',
			theme: 'wp-theme-2018',
			languages: ['en'],
			debug: false,
			type: 'basic',
			expiration: 10800 as 10800 | 21600 | 43200,
		},
	});

	const formState = form.formState;

	const onSubmit: SubmitHandler<FormValues> = async (data) => {
		setIsSubmitting(true);
		setSubmissionResult(null);

		try {
			const wordpressSite = {
				wordpress: {
					title: data.title,
					tagline: data.tagline,
					theme: data.theme,
					languages: data.languages,
					debug: data.debug,
					type: data.type,
					expiration: data.expiration,
				},
			};

			const response = await fetch('/api/create', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(wordpressSite),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Failed to create WordPress site');
			}

			const result = await response.json();

			setSubmissionResult({
				success: true,
				message: t('submit.success.text'),
				url: result.url,
			});
		} catch (error) {
			console.error('Error configuring site:', error);
			setSubmissionResult({
				success: false,
				message: error instanceof Error ? `${t('submit.error.text')}: ${error.message}` : t('submit.error.text'),
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-6 w-full">
			<h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
			<p className="text-gray-600 mb-2">{t('subTitle')}</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="space-y-6 bg-white py-4">
							<h2 className="text-xl font-semibold mb-4">{t('information.title')}</h2>
							<Separator className="mb-6" />

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('information.name.label')}</FormLabel>
										<FormControl>
											<Input placeholder={t('information.name.placeholder')} {...field} />
										</FormControl>
										<FormDescription>{t('information.name.description')}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="tagline"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('information.tagline.label')}</FormLabel>
										<FormControl>
											<Input placeholder={t('information.tagline.placeholder')} {...field} />
										</FormControl>
										<FormDescription>{t('information.tagline.description')}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-6 bg-white py-4">
							<h2 className="text-xl font-semibold mb-4">{t('settings.title')}</h2>
							<Separator className="mb-6" />

							<FormField
								control={form.control}
								name="theme"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('settings.theme.label')}</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a theme" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="wp-theme-2018">EPFL 2018</SelectItem>
												<SelectItem value="wp-theme-light">EPFL Light</SelectItem>
												<SelectItem value="epfl-master">EPFL Master</SelectItem>
												<SelectItem value="epfl-blank">EPFL Blank</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>{t('settings.theme.description')}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="languages"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('settings.language.label')}</FormLabel>
										<div className="grid grid-cols-2 gap-4">
											{['en', 'fr', 'de', 'it'].map((lang) => (
												<div key={lang} className="flex items-center space-x-2">
													<Checkbox
														id={`lang-${lang}`}
														checked={field.value.includes(lang)}
														onCheckedChange={(checked) => {
															const newValue = checked ? [...field.value, lang] : field.value.filter((l) => l !== lang);
															field.onChange(newValue);
														}}
													/>
													<label htmlFor={`lang-${lang}`} className="text-sm font-medium">
														{lang.toUpperCase()}
													</label>
												</div>
											))}
										</div>
										<FormDescription>{t('settings.language.description')}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('settings.type.label') || 'Site Type'}</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a site type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="basic">Basic</SelectItem>
												<SelectItem value="academic">Academic</SelectItem>
												<SelectItem value="lab">Laboratory</SelectItem>
												<SelectItem value="project">Project</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>{t('settings.type.description') || 'Choose the type of WordPress site you want to create.'}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="expiration"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('settings.expiration.label') || 'Site Expiration'}</FormLabel>
										<Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select expiration time" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="10800">3 Hours</SelectItem>
												<SelectItem value="21600">6 Hours</SelectItem>
												<SelectItem value="43200">12 Hours</SelectItem>
											</SelectContent>
										</Select>
										<FormDescription>{t('settings.expiration.description') || 'Choose how long your site will be available.'}</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="debug"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>{t('settings.debug.label') || 'Enable Debug Mode'}</FormLabel>
											<FormDescription>{t('settings.debug.description') || 'Enable debug mode for development purposes.'}</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</div>
					</div>

					{submissionResult && (
						<div className={cn('mt-6 flex items-center gap-1 p-3', submissionResult.success ? 'border border-green-500 text-green-400' : 'border border-red-500 text-red-400')}>
							{submissionResult.success ? <CircleCheck className="h-5 w-5" /> : <CircleAlert className="h-5 w-5" />}
							<span>{submissionResult.message}</span>
							{submissionResult.url && <span className="ml-2">{submissionResult.url}</span>}
						</div>
					)}

					<div className="flex justify-end gap-2 pt-6">
						<Button variant="outline" type="button" onClick={() => form.reset()}>
							Reset
						</Button>
						<Button type="submit" className="cursor-pointer" disabled={isSubmitting || !formState.isValid}>
							{isSubmitting ? 'Creating...' : t('submit.text')}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
