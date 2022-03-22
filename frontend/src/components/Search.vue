<template>
	<div>
		<h1>{{title}}</h1>
		<hr>
		<form onsubmit="return false">
			<input 
				v-model="searchTerm" 
				type="text" 
				id="searchTerm" 
				class="form-control" 
				placeholder="Enter any search term">
			<button 
				@click="$emit('emit-search', searchTerm)" 
				class="btn btn-primary">
				Search
			</button>
		</form>
	</div>
</template>

<script>
export default {
	name: 'Search',
	props: {
		title: String
	},
	data() {
		return {
			searchTerm: ''
		}
	}
}
</script>

<style scoped>
	input {
		margin: 5px;
		width: 75%;
		display: inline;
	}
	button {
		width: 20%;
	}
</style>