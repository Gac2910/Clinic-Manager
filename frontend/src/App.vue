<template>
	<div>
		<Header
			:type="userType">
		</Header>
		<router-view
			@emit-query="queryCollection"
			@emit-insert="insertDocument"
			@emit-update="updateDocument"
			@emit-delete="deleteDocument"
			@emit-login-status="updateLoginStatus"
			@emit-pagination="pagination">
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
			userType: '',
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
                        if (data.length === 0) {
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
		updateLoginStatus: function (type) {
			this.userType = type;
		},
		pagination: function (rowsShown, rowsTotal) {
			$(document).ready(function () {
				rowsShown = rowsShown === '' ? 5 : rowsShown;
				let pages = rowsTotal / rowsShown;
				// create pagination nav buttons
				$('#paginationNav').html('')
				for (let i = 0; i < pages; i++) {
					$('#paginationNav').append(`<button data-active="${i}" class="btn btn-primary" style="margin:5px 3px!important">${i + 1}</button>`);
				}
				// show only the rowsShown amount
				$('#dataTable tbody tr').css('display','none');
				$('#dataTable tbody tr').slice(0, rowsShown).show();
				// add css class to first button
				$('#paginationNav button').filter(':first').addClass('activePagination');

				// add on click event to buttons
				$('#paginationNav button').on('click', function () {
					// toggle css class
					$('#paginationNav button').removeClass('activePagination');
					$(this).addClass('activePagination');
					// determine start and end item using value from rel attribute
					let activePage = $(this).data('active');
					let startItem = activePage * rowsShown;
					let endItem = startItem + rowsShown;
					// show rows between startItem and endItem and animate
					$('#dataTable tbody tr').css('opacity','0.0').hide();
					$('#dataTable tbody tr').slice(startItem, endItem).css('display','table-row').animate({opacity:1}, 300);
				});
			});
		}
    },
	mounted() {
		let user = JSON.parse(sessionStorage.getItem('user'));
		this.userType = user ? user.type : '';
	}
}
</script>

<style>
body {
	background: rgb(217, 234, 243);
}
a, a:hover{
	text-decoration: none;
	color: inherit;
}
table {
	width: 100%;
}
.btn-success, .btn-primary {
	margin: 5px 0 !important;
}
.fa-trash, .fa-refresh {
	font-size: 25px;
	margin: 0 5px;
	cursor: pointer;
}
.fa:hover {
	color: blue;
}
table {
	width: 100%;
	text-align: center;
}
thead tr {
	background: gray;
	color: white;
}
tbody tr:nth-child(even) {
	background: rgb(216, 216, 216);
}
.activePagination {
	background: rgb(37, 71, 134);
}
#numberOfRows {
	width: 30%;
	margin: 5px 0;
	height: 30px;
}
#dataTable tbody tr {
	display: none;
}
</style>
