import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

interface ReturnObject extends Record<string, unknown> {
	success: boolean;
	errors: string[];
	email: string;
	passwordConfirmation?: never;
	name?: never;
	password: string;
}

/**
 * Form actions.
 * To connect to a frontend form, must set action="POST"
 * on the form element.
 */
export const actions: Actions = {
	signInWithPassword: async ({ request, locals: { supabase } }) => {
		// Does something with given event
		const formData = await request.formData();

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const returnObject: ReturnObject = {
			success: true,
			email, // Give values back to form
			password,
			errors: []
		};

		if (!email.length) {
			returnObject.errors.push('Email is required.');
		}

		if (!password.length) {
			returnObject.errors.push('Password is required.');
		}

		if (returnObject.errors.length) {
			returnObject.success = false;
			return returnObject;
		}

		// Registration flow
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		if (error || !data.user) {
			console.log('There has been an error');
			console.log(error);
			returnObject.success = false;
			return fail(400, returnObject);
		}

		redirect(303, '/private/dashboard');
	},
	googleLogin: async ({ locals: { supabase } }) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`
			}
		});

		if (error) {
			return fail(400, {
				message: 'Something went wrong with Google login'
			});
		}

		throw redirect(303, data.url);
	}
};
