<script>
	const { data } = $props();
</script>

<ul>
	{#each data.chat as chat (chat.id)}
		<li>
			{chat.sender_id}
			{chat.message}
		</li>
	{/each}
</ul>
