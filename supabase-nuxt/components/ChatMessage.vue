<script setup lang="ts">
const props = defineProps(["user", "time", "message"])

const locale = Intl.NumberFormat().resolvedOptions().locale
const today = new Date().toLocaleDateString(locale)
const yesterday = new Date(
	new Date().setDate(new Date().getDate() - 1),
).toLocaleDateString(locale)

const getWeek = (date: Date) => {
	const d = new Date(date.getTime())
	d.setHours(0, 0, 0, 0)

	const day = d.getDay() === 0 ? 7 : d.getDay()
	d.setDate(d.getDate() + 4 - day)

	const yearStart = new Date(d.getFullYear(), 0, 1)

	return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

const getMessageDate = (date: string) => {
	const localeDate = new Date(date).toLocaleDateString(locale)

	if (today == localeDate) {
		return `Today at ${new Date(date).toLocaleTimeString(locale, {
			hour: "numeric",
			minute: "numeric",
		})}`
	}

	if (yesterday == localeDate) {
		return `Yesterday at ${new Date(date).toLocaleTimeString(locale, {
			hour: "numeric",
			minute: "numeric",
		})}`
	}

	if (getWeek(new Date()) == getWeek(new Date(date))) {
		return `${new Date(date).toLocaleDateString(locale, {
			weekday: "long",
		})} at ${new Date(date).toLocaleTimeString(locale, {
			hour: "numeric",
			minute: "numeric",
		})}`
	}

	return `${new Date(date).toLocaleDateString(locale)}
				${new Date(date).toLocaleTimeString(locale, {
					hour: "numeric",
					minute: "numeric",
				})}`
}
</script>

<template>
	<li>
		<div>
			<p>{{ props.user }}</p>
			<time>{{ getMessageDate(props.time) }}</time>
		</div>
		<p>{{ props.message }}</p>
	</li>
</template>

<style>
p {
	margin: 0;
}

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
</style>
