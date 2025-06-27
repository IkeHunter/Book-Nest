import type { Actions } from './$types';

interface ReturnObject {
	success: boolean;
	errors: string[];
}

/**
 * Form actions.
 * To connect to a frontend form, must set action="POST"
 * on the form element.
 */
export const actions: Actions = {
	default: async ({ request }) => {
		// Does something with given event
		const formData = await request.formData();

		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirmation = formData.get('passwordConfirmation') as string;

		const returnObject: ReturnObject = {
			success: true,
			errors: []
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

		return returnObject;
	}
};
