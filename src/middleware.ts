import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const ADMIN_ROUTES = ['/all'];

export async function middleware(req: NextRequest) {
	try {
		const token = await getToken({
			req,
			secret: process.env.AUTH_SECRET,
		});

		const pathname = req.nextUrl.pathname;

		if (!token) {
			return NextResponse.redirect(new URL('/api/auth/signin', req.url));
		}

		if (ADMIN_ROUTES.includes(pathname)) {
			if (!token.role || token.role !== 'admin') {
				return NextResponse.redirect(new URL(`/error?type=Unauthorized`, req.url));
			}
		}

		return NextResponse.next();
	} catch (error) {
		console.error('Error in middleware:', error);
		return NextResponse.redirect(new URL('/error?type=Unauthorized', req.url));
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|error|_next/image|favicon.ico).*)'],
};
