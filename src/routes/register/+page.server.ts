import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

interface ReturnObject extends Record<string, unknown> {
	success: boolean;
	errors: string[];
	email: string;
	passwordConfirmation: string;
	name: string;
	password: string;
}

/**
 * Form actions.
 * To connect to a frontend form, must set action="POST"
 * on the form element.
 */
export const actions: Actions = {
	default: async ({ request, locals: { supabase } }) => {
		// Does something with given event
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirmation = formData.get('passwordConfirmation') as string;

		const returnObject: ReturnObject = {
			success: true,
			errors: [],
			email,
			name,
			password,
			passwordConfirmation
		};

		if (name.length < 3) {
			returnObject.errors.push('Name has to be at least 3 characters.');
		}

		if (!email.length) {
			returnObject.errors.push('Email is required.');
		}

		if (!password.length) {
			returnObject.errors.push('Password is required.');
		}

		if (password !== passwordConfirmation) {
			returnObject.errors.push('Passwords do not match.');
		}

		if (returnObject.errors.length) {
			returnObject.success = false;
			return returnObject;
		}

		// Registration flow
		const { data, error } = await supabase.auth.signUp({ email, password });

		if (error || !data.user) {
			console.log('There has been an error');
			console.log(error);
			returnObject.success = false;
			return fail(400, returnObject);
		}

		const userId = data.user.id;

		await supabase.from('user_names').insert([
			{
				user_id: userId,
				name
			}
		]);

		redirect(303, '/private/dashboard');
	}
};
