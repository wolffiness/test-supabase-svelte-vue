<script lang="ts">
	import { resolve } from '$app/paths';
</script>

<h1>Hi and welcome to the Sveltekit chat!</h1>
<a href={resolve('/chat')}>Go to chat</a>

<style>
	h1,
	a {
		text-align: center;
		font-family: Verdana, Geneva, Tahoma, sans-serif;
	}

	a {
		display: block;
	}
</style>
