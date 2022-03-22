<template>
	<div class="page-box">
		<h1 :class="{padBottom: !hr}">{{ title }}</h1>
		<hr v-if="hr">
		<slot></slot>
	</div>
</template>

<script>
export default {
	name: "Box",
	props: {
		title: {
			type: String,
			default: "Box Component"
		},
		hr: Boolean
	}
}
</script>

<style scoped>
.page-box {
	background: rgb(245, 245, 245);
	border-radius: 5px;
	box-shadow: 1px 1px 5px black;
	width: calc(100% - 25px);
	margin: 15px auto;
	padding: 10px;
}
.padBottom {
	margin-bottom: 5px;
}
</style>