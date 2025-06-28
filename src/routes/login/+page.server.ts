import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

interface ReturnObject extends Record<string, unknown> {
	success: boolean;
	errors: string[];
  email: string,
  passwordConfirmation?: never
  name?: never
  password: string
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
	}
};
