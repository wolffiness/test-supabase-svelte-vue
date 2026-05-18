<script setup lang="ts">
import { ref, onMounted } from "vue"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types.js"
import ChatMessage from "../components/ChatMessage.vue"

const config = useRuntimeConfig()
const supabase = createClient<Database>(
	config.public.supabaseUrl,
	config.public.supabaseKey,
)

let message = ref("")
const chat = ref<Database["public"]["Tables"]["chat"]["Row"][]>([])
const disabled = computed(() => message.value.length === 0)

async function getMsgs() {
	const { data } = await supabase.from("chat").select()
	chat.value = data as Database["public"]["Tables"]["chat"]["Row"][]
}

const handleSubmit = async (e: SubmitEvent) => {
	const form = e.target as HTMLFormElement
	const formData = {
		sender_id: "Leo",
		...Object.fromEntries(new FormData(form)),
	}

	const { data: insertedRows } = await supabase
		.from("chat")
		.insert(formData)
		.select()
		.limit(1)

	const inserted = insertedRows?.[0]
	if (inserted) {
		if (!chat.value.some((m: any) => m.id === inserted.id)) {
			chat.value = [...chat.value, inserted]
		}
	}

	form.reset()
	message.value = ""
}

onMounted(() => {
	getMsgs()
})
</script>

<template>
	<div class="container">
		<ul>
			<ChatMessage
				v-for="message in chat"
				:key="message.id"
				:user="message.sender_id"
				:time="message.created_at"
				:message="message.message"
			/>
		</ul>

		<form v-on:submit.prevent="handleSubmit">
			<input
				v-model="message"
				id="message"
				name="message"
				type="text"
				placeholder="Write your message"
			/>
			<button type="submit" :disabled="disabled">Send</button>
		</form>
	</div>
</template>

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
