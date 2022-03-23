<template>
	<div class="container" v-if="userType === '1'">
		<div class="row">
			<div class="col-lg-4">
				<Box title="All Users" hr>
					<h3 v-if="formType === 'insert'">Add A New User</h3>
					<h3 v-if="formType === 'update'">Update A User</h3>
					<form onsubmit="return false">
						<label for="username">Username</label>
						<input v-model="form.username" type="text" id="username" class="form-control" placeholder="Username">
						<label for="password">Password</label>
						<input v-model="form.password" type="text" id="password" class="form-control" placeholder="Password">
						<label for="staffRadio">Staff</label>
						<input v-model="form.type" type="radio" name="userType" id="staffRadio" value="0" checked>
						<br>
						<label for="adminRadio">Admin</label>
						<input v-model="form.type" type="radio" name="userType" id="adminRadio" value="1">
						<button v-if="formType === 'insert'" @click="submitInsertClick" class="btn btn-success" type="submit" style="width:100%">Submit</button>
						<button v-if="formType === 'update'" @click="submitUpdateClick" class="btn btn-success" type="submit" style="width:100%">Update</button>
					</form>
				</Box>
			</div>
			<div class="col-lg-8">
				<Box title="Search All Users" hr>
					<Search
						@emit-search="search" >
					</Search>
				</Box>
				<Box title="Users Table" hr>
					<input 
						v-model="rowsShown" 
						@change="$emit('emit-pagination', rowsShown, users.length)" 
						type="number" 
						id="numberOfRows" 
						min="1"
						class="form-control"
						placeholder="Enter number of rows">
					<table id="dataTable">
						<thead>
							<tr>
								<th>Username</th>
								<th>Password</th>
								<th>Type</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(user, i) in users" :key="i">
								<td>{{user.username}}</td>
								<td>{{user.password}}</td>
								<td>{{user.type === '1' ? 'Admin': 'Staff'}}</td>
								<td>
									<i class="fa fa-refresh" @click="updateIconClick(user)"></i>
									<i class="fa fa-trash" @click="deleteIconClick(user._id)"></i>
								</td>
							</tr>
						</tbody>
					</table>
					<div id="paginationNav"></div>
				</Box>
			</div>
		</div>
	</div>
</template>

<script>
import Search from "@/components/Search";
import Box from "@/components/Box";
export default {
    name: 'AllUsers',
    components: {
		Search,
		Box
	},
    data() {
		return {
			form: {
				username: '',
				password: '',
				type: '0',
			},
			users: [],
			formType: 'insert',
            updateID: '',
            userType: '',
			rowsShown: ''
		}
    },
    methods: {
		getAll: function () {
			let $this = this;
			this.$emit('emit-query', 'Users', {}, (err, data) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				$this.users = data;
				$this.emitPagination();
			});
		},
		submitInsertClick: function () {
			for (let key in this.form) {
				if (!this.form[key].trim()) {
					Swal.fire('Error', `Please enter ${key}`, 'error');
					return;
				}
			}
			let $this = this;
			this.$emit('emit-insert', 'Users', this.form, (err) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				Swal.fire('Inserted Successfully', '', 'success');
				$this.getAll();
				$this.clearForm();
			});
		},
		submitUpdateClick: function () {
			let $this = this;
			this.$emit('emit-update', 'Users', this.form, this.updateID, (err) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				Swal.fire('Updated Successfully', '', 'success');
				$this.formType = 'insert';
				$this.getAll();
				$this.clearForm();
			});
		},
		updateIconClick: function (document) {
			this.formType = 'update';
			this.form = document;
			this.updateID = document._id;
		},
		deleteIconClick: function (id) {
			let $this = this;
			Swal.fire({
				title: 'Are you sure you want to delete this patient?',
				showCancelButton: true,
				confirmButtonText: 'Delete'
			}).then(result => {
				if (result.isConfirmed) {
					$this.$emit('emit-delete', 'Users', id, (err) => {
						if (err) {
							Swal.fire('Error', err, 'error');
							return;
						}
						let filteredForm = this.users.filter(patient => {
							return patient._id != id;
						});
						$this.users = filteredForm;
					});
				}
			});
		},
		search: function (searchTerm) {
            searchTerm = searchTerm.match(/Staff/gi) ? '0': searchTerm.match(/Admin/gi) ? '1': searchTerm;
			let query = {
				"$or": [
					{"username": searchTerm},
					{"password": searchTerm},
					{"type": searchTerm}
				]
			};
			let $this = this;
			this.$emit('emit-query', 'Users', query, (err, data) => {
				if (err) {
					Swal.fire(err, '', 'error');
					return;
				}
				$this.users = data;
			});
		},
		clearForm: function () {
			for (let property in this.form) {
				this.form[property] = '';
			}
		},
		emitPagination: function () {
			this.$emit('emit-pagination', this.rowsShown, this.users.length);
		}
	},
    mounted() {
        this.getAll();
        let user = JSON.parse(sessionStorage.getItem('user'));
        this.userType = user ? user.type : '';
        if (this.userType != 1) {
            Swal.fire('Login as admin to view this collection.', '','info');
        }
    }
}
</script>

<style scoped>
    input[type="radio"] {
        margin: 10px 5px;
    }
</style>