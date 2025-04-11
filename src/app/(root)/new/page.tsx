'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

const wordpressSiteSchema = z.object({
	title: z.string().min(1),
	tagline: z.string().min(1),
	theme: z.enum(['wp-theme-2018', 'wp-theme-light', 'epfl-master', 'epfl-blank']),
	languages: z.array(z.string().regex(/^[a-z]{2}$/)).min(1),
	debug: z.boolean().default(false),
});

type FormValues = z.infer<typeof wordpressSiteSchema>;

export default function NewWordpressSite() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionResult, setSubmissionResult] = useState<{ success: boolean; message: string } | null>(null);

	const t = useTranslations('NewSite');

	const form = useForm<FormValues>({
		resolver: zodResolver(wordpressSiteSchema),
		defaultValues: {
			theme: 'wp-theme-2018',
			languages: ['en'],
			debug: false,
		},
	});

	const formState = form.formState;

	async function onSubmit(data: FormValues) {
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
					plugins: {},
				},
			};

			console.log('Submitting WordPress configuration:', wordpressSite);

			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSubmissionResult({
				success: true,
				message: t('submit.success.text'),
			});
		} catch (error) {
			console.error('Error configuring site:', error);
			setSubmissionResult({
				success: false,
				message: error instanceof Error ? error.message : t('submit.error.text'),
			});
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="p-6 w-full">
			<h1 className="text-3xl font-bold mb-1">{t('title')}</h1>
			<p className="text-gray-600 mb-2">{t('subTitle')}</p>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Left Column */}
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

						{/* Right Column */}
						<div className="space-y-6 bg-white py-6">
							<h2 className="text-xl font-semibold mb-4">{t('settings.title')}</h2>
							<Separator className="mb-6" />

							<FormField
								control={form.control}
								name="theme"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('settings.theme.label')}</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
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
						</div>
					</div>

					{submissionResult && (
						<Alert variant={submissionResult.success ? 'default' : 'destructive'} className="mt-6">
							<AlertDescription>{submissionResult.message}</AlertDescription>
						</Alert>
					)}

					<div className="flex justify-end gap-4 pt-6">
						<Button variant="outline" type="button" onClick={() => form.reset()}>
							Reset
						</Button>
						<Button type="submit" disabled={isSubmitting || !formState.isValid}>
							{isSubmitting ? 'Creating...' : t('submit.text')}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
