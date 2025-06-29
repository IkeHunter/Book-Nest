<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { Header } from '$components';
	import { setUserState } from '$lib/state/user-state.svelte';
	import '../app.css';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	// Initialize with data on first render
	let userState = setUserState({ session: data.session, supabase: data.supabase, user: data.user });

	// $effect(() => {
	// 	// After first render, these are the most updated values
	// 	userState.updateState({ session, supabase, user });
	// });

	$effect(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			userState.updateState({ session: newSession, supabase, user: newSession?.user || null });
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Header />
{@render children()}
