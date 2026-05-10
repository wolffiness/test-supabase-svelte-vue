<script lang="ts">
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import { supabase } from '$lib/supabaseClient';

	const { data } = $props();
	const locale = Intl.NumberFormat().resolvedOptions().locale;
	const today = new Date().toLocaleDateString(locale);
	const yesterday = new Date(new SvelteDate().setDate(new Date().getDate() - 1)).toLocaleDateString(
		locale
	);
	let messages = $derived(Array.isArray(data?.chat) ? data.chat.slice() : []);
	let message = $state('');
	let disabled = $derived(true);

	$effect(() => {
		disabled = message.length > 0 ? false : true;
	});

	const getWeek = (date: Date) => {
		const d = new SvelteDate(date.getTime());
		d.setHours(0, 0, 0, 0);

		const day = d.getDay() === 0 ? 7 : d.getDay();
		d.setDate(d.getDate() + 4 - day);

		const yearStart = new Date(d.getFullYear(), 0, 1);

		return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
	};

	const getMessageDate = (date: string) => {
		const localeDate = new Date(date).toLocaleDateString(locale);

		if (today == localeDate) {
			return `Today at ${new Date(date).toLocaleTimeString(locale, {
				hour: 'numeric',
				minute: 'numeric'
			})}`;
		}

		if (yesterday == localeDate) {
			return `Yesterday at ${new Date(date).toLocaleTimeString(locale, {
				hour: 'numeric',
				minute: 'numeric'
			})}`;
		}

		if (getWeek(new Date()) == getWeek(new Date(date))) {
			return `${new Date(date).toLocaleDateString(locale, {
				weekday: 'long'
			})} at ${new Date(date).toLocaleTimeString(locale, {
				hour: 'numeric',
				minute: 'numeric'
			})}`;
		}

		return `${new Date(date).toLocaleDateString(locale)}
				${new Date(date).toLocaleTimeString(locale, {
					hour: 'numeric',
					minute: 'numeric'
				})}`;
	};

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
			<li>
				<div>
					<p>{chat.sender_id}</p>
					<time>{getMessageDate(chat.created_at)}</time>
				</div>
				<p>{chat.message}</p>
			</li>
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

	p {
		margin: 0;
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
	li {
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	li {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		flex-grow: 1;
		padding: 1em;
		border-radius: 5px;
		background-color: #ededed;
	}

	li > div {
		font-size: 12px;
		display: flex;
		align-items: center;
		gap: 0.5em;
	}

	li > div > time {
		font-size: 10px;
		opacity: 0.75;
	}

	li > p {
		font-size: 16px;
	}

	form {
		width: 20em;
		display: flex;
	}

	form > input {
		flex-grow: 1;
	}
</style>
