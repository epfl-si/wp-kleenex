import { Session } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: User;
	}
	interface User {
		username: string;
		name: string;
		email: string;
		image: string;
		employeeId: string;
		role: string;
	}
}
