<script lang="ts">
	import { BookCard } from '$components';
	import type { Book } from '$lib/state/user-state.svelte';

	interface BookCategoryProps {
		categoryName: string;
		books: Book[];
	}
	let { categoryName, books }: BookCategoryProps = $props();
</script>

<section class="book-category mb-m">
	<h3 class="mb-s">{categoryName}</h3>
	<div class="books-container">
		{#each books as book}
			<BookCard {book} />
		{/each}
	</div>
</section>

<style>
	.books-container {
		display: flex;
		overflow-x: auto;
		gap: 16px;
		padding-bottom: 8px;
		scrollbar-width: thin; /* Firefox */
	}

	.books-container::webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.2);
		border-radius: 3px;
	}
</style>
