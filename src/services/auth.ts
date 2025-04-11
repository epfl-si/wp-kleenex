import NextAuth, { Account, User } from 'next-auth';
import MicrosoftEntraID from 'next-auth/providers/microsoft-entra-id';
import fs from 'fs';

function decodeTokenPayload(token: string): any {
	if (!token) return null;
	const payloadBase64 = token.split('.')[1];
	if (!payloadBase64) return null;
	try {
		return JSON.parse(Buffer.from(payloadBase64, 'base64').toString());
	} catch (error) {
		console.error('Failed to decode token payload:', error);
		return null;
	}
}

function getAccessToken(account: Account): { roles: string[]; exp: number; tid: string } | null {
	if (!account.access_token) return null;
	return decodeTokenPayload(account.access_token);
}

async function getEmployeeInfo(account: Account): Promise<{ employeeId: string; name: string } | null> {
	try {
		const accessToken = account.access_token;
		if (!accessToken) return null;

		const response = await fetch(`${process.env.AUTH_MICROSOFT_GRAPH_API_URL}/me?$select=employeeId,id,displayName,jobTitle,mail,surname,userPrincipalName`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch employee ID: ${response.status}`);
		}

		const data = await response.json();
		console.log('Employee ID:', data);
		return {
			employeeId: data.employeeId,
			name: data.displayName,
		};
	} catch (error) {
		console.error('Error fetching employee ID:', error);
		return null;
	}
}

async function getRole(account: Account): Promise<string> {
	try {
		const accessToken = account.access_token;
		if (!accessToken) return 'denied';

		const fetchData = async (url: string) => {
			const response = await fetch(url, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch group memberships: ${response.status}`);
			}

			return await response.json();
		};

		let data = await fetchData(`${process.env.AUTH_MICROSOFT_GRAPH_API_URL}/me/memberOf`);
		let groups = data.value || [];

		while (data['@odata.nextLink']) {
			data = await fetchData(data['@odata.nextLink']);
			groups = groups.concat(data.value || []);
		}

		fs.writeFileSync('groups.json', JSON.stringify(groups, null, 2));

		if (!groups || !groups.length) return 'member';
		if (groups.some((group: any) => group.displayName === process.env.ADMIN_GROUP + '_AppGrpU')) return 'admin';
		return 'member';
	} catch (error) {
		console.error('Error fetching group memberships:', error);
		return 'denied';
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		MicrosoftEntraID({
			clientId: process.env.AUTH_MICROSOFT_ENTRA_ID,
			clientSecret: process.env.AUTH_MICROSOFT_ENTRA_SECRET,
			issuer: process.env.AUTH_MICROSOFT_ENTRA_ISSUER,
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				try {
					const employeeInfo = await getEmployeeInfo(account);
					const role = await getRole(account);

					const decodedToken = getAccessToken(account);

					return {
						...token,
						employeeId: employeeInfo?.employeeId || null,
						name: employeeInfo?.name || null,
						role,
						tid: decodedToken?.tid,
						tokenExpiration: decodedToken?.exp,
					};
				} catch (error) {
					console.error('Error enhancing JWT:', error);
					return token;
				}
			}

			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					...session.user,
					employeeId: token.employeeId as string,
					role: token.role as string,
					name: token.name as string,
				};
			}
			return session;
		},
	},
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: '/api/auth',
	},
});
