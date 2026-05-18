<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import ChatMessage from '../../lib/components/ui/ChatMessage.svelte';

	const { data } = $props();
	let messages = $derived(Array.isArray(data?.chat) ? data.chat.slice() : []);
	let message = $state('');
	let disabled = $derived(true);

	$effect(() => {
		disabled = message.length > 0 ? false : true;
	});

	onMount(() => {
		const channel = supabase
			.channel('public:chat')
			.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat' }, (formData) => {
				const newRow = formData.new;
				if (!messages.some((m: any) => m.id === newRow.id)) {
					messages = [...messages, newRow];
				}
			})
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	});

	const handleSubmit = async (e: SubmitEvent) => {
		const form = e.target as HTMLFormElement;
		const formData = {
			sender_id: 'Leo',
			...Object.fromEntries(new FormData(form))
		};

		const { data: insertedRows } = await supabase.from('chat').insert(formData).select().limit(1);

		const inserted = insertedRows?.[0];
		if (inserted) {
			if (!messages.some((m: any) => m.id === inserted.id)) {
				messages = [...messages, inserted];
			}
		}

		form.reset();
		message = '';
	};
</script>

<div class="container">
	<ul>
		{#each messages as chat (chat.id)}
			<ChatMessage user={chat.sender_id} time={chat.created_at} message={chat.message} />
		{/each}
	</ul>

	<form onsubmit={handleSubmit}>
		<input
			bind:value={message}
			id="message"
			name="message"
			type="text"
			placeholder="Write your message"
		/>
		<button type="submit" {disabled}>Send</button>
	</form>
</div>

<style>
	.container {
		width: 100vw;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
		align-items: center;
	}

	ul {
		width: 20em;
		list-style-type: none;
		margin: 0;
		padding: 2em 0 0 0;
		display: flex;
		flex-direction: column;
		gap: 1em;
	}

	form > button,
	form > input,
	form {
		width: 20em;
		display: flex;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	form > input {
		flex-grow: 1;
	}
</style>
