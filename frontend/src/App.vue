<template>
	<div>
		<Header
			:type="type">
		</Header>
		<router-view
			@emit-query="queryCollection"
			@emit-insert="insertDocument"
			@emit-update="updateDocument"
			@emit-delete="deleteDocument"
			@emit-login-status="updateLoginStatus">
		</router-view>
	</div>
</template>

<script>
import Header from "@/components/Header.vue";
export default {
	name: "AppComponent",
	components: {
		Header
	},
	data() {
		return {
			type: '',
		}
	},
	methods: {
        queryCollection: function (collection, query, callback) {
            $.ajax({
                type: 'POST',
                url: `${baseURL}/query/${collection}`,
                data: query,
                success: function (data, status) {
                    if (status === 'success') {
						data = JSON.parse(data);
                        if (!data.length) {
							callback('No Results', data)
                            return;
                        }
						callback('', data);
                    }
                },
                error: function (xhr) {
                    console.error(xhr);
					callback('Error Getting Results');
                }
            });
        },
		insertDocument: function (collection, data, callback) {
			$.ajax({
                type: 'POST',
                url: `${baseURL}/insert/${collection}`,
                data: data,
                success: function (data, status) {
                    if (status === 'success') {
						callback('');
                    }
                },
                error: function (xhr) {
                    console.error(xhr);
					callback('Error Inserting Document');
                }
            });
		},
		updateDocument: function (collection, data, id, callback) {
			$.ajax({
                type: 'PUT',
                url: `${baseURL}/update/${collection}/${id}`,
                data: data,
                success: function (data, status) {
                    if (status === 'success') {
						callback('');
                    }
                },
                error: function (xhr) {
                    console.error(xhr);
					callback('Error Updating Document');
                }
            });
		},
		deleteDocument: function (collection, id, callback) {
			$.ajax({
                type: 'DELETE',
                url: `${baseURL}/delete/${collection}/${id}`,
                success: function (data, status) {
                    if (status === 'success') {
						callback('');
                    }
                },
                error: function (xhr) {
                    console.error(xhr);
					callback('Error Deleting Document');
                }
            });
		},
		// emit function from home page sets the login type for the header (0, 1, or undefined)
		// 0 and 1 are staff and admin
		// undefined is no user
		updateLoginStatus: function (type) {
			this.type = type;
		}
    },
	mounted() {
		// get user from sessionStorage or empty object
		// this is so the header displays the correct login
		this.type = JSON.parse(sessionStorage.getItem('user')).type || '';
	}
}
</script>

<style>
a, a:hover{
	text-decoration: none;
	color: inherit;
}
.btn {
	margin: 10px 0px;
}
table {
	width: 100%;
}
.fa-trash, .fa-refresh {
	font-size: 25px;
	margin: 0 5px;
	cursor: pointer;
}
.fa:hover {
	color: blue;
}
</style>
