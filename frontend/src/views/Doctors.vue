<template>
	<div class="container" v-if="loggedUser.type">
		<div class="row">
			<div class="col-lg-4" v-if="loggedUser.type === '1'">
				<Box title="Doctors" hr>
					<h3 v-if="formType === 'insert'">Add A New Doctor</h3>
					<h3 v-if="formType === 'update'">Update A Doctor</h3>
					<form onsubmit="return false">
						<label for="first_name">First Name</label>
						<input v-model="form.first_name" type="text" id="first_name" class="form-control" placeholder="First Name">
						<label for="last_name">Last Name</label>
						<input v-model="form.last_name" type="text" id="last_name" class="form-control" placeholder="Last Name">
						<label for="phone_number">Phone Number</label>
						<input v-model="form.phone_number" type="tel" id="phone_number" class="form-control" placeholder="Phone Number">
						<label for="specialty">Specialty</label>
						<input v-model="form.specialty" type="tel" id="specialty" class="form-control" placeholder="Specialty">
						<button v-if="formType === 'insert'" @click="submitInsertClick" class="btn btn-success" type="submit" style="width:100%">Submit</button>
						<button v-if="formType === 'update'" @click="submitUpdateClick" class="btn btn-success" type="submit" style="width:100%">Update</button>
					</form>
				</Box>
			</div>
			<div class="col-lg-8">
				<Box title="Search Doctors" hr>
					<Search
						@emit-search="search">
					</Search>
				</Box>
				<Box title="Doctors Table" hr>
					<table>
						<thead>
							<tr>
								<th>Full Name</th>
								<th>Phone Number</th>
								<th>Specialty</th>
								<th v-if="loggedUser.type === '1'">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(doctor, i) in doctors" :key="i">
								<td>{{doctor.first_name}} {{doctor.last_name}}</td>
								<td>{{doctor.phone_number}}</td>
								<td>{{doctor.specialty}}</td>
								<td v-if="loggedUser.type === '1'">
									<i class="fa fa-refresh" @click="updateIconClick(doctor)"></i>
									<i class="fa fa-trash" @click="deleteIconClick(doctor._id)"></i>
								</td>
							</tr>
						</tbody>
					</table>
				</Box>
			</div>
		</div>
	</div>
</template>

<script>
import Search from "@/components/Search";
import Box from "@/components/Box";
export default {
	name: 'Doctors',
	components: {
		Search,
		Box
	},
	data() {
		return {
			form: {
				first_name: '',
				last_name: '',
				phone_number: '',
				specialty: ''
			},
			doctors: [],
			formType: 'insert',
			updateID: '',
			loggedUser: {}
		}
	},
	methods: {
		getAll: function () {
			let $this = this;
			this.$emit('emit-query', 'Doctors', {}, (err, data) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				$this.doctors = data;
			});
		},
		submitInsertClick: function () {
			let $this = this;
			this.$emit('emit-insert', 'Doctors', this.form, (err) => {
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
			this.$emit('emit-update', 'Doctors', this.form, this.updateID, (err) => {
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
				title: 'Are you sure you want to delete this doctor?',
				showCancelButton: true,
				confirmButtonText: 'Delete'
			}).then(result => {
				if (result.isConfirmed) {
					$this.$emit('emit-delete', 'Doctors', id, (err) => {
						if (err) {
							Swal.fire('Error', err, 'error');
							return;
						}
						let filteredForm = this.doctors.filter(doctor => {
							return doctor._id != id;
						});
						$this.doctors = filteredForm;
					});
				}
			});
		},
		search: function (searchTerm) {
			let query = {
				"$or": [
					{"first_name": searchTerm},
					{"last_name": searchTerm},
					{"phone_number": searchTerm},
					{"specialty": searchTerm}
				]
			};
			let $this = this;
			this.$emit('emit-query', 'Doctors', query, (err, data) => {
				if (err) {
					Swal.fire(err, '', 'error');
					return;
				}
				$this.doctors = data;
			});
		},
		clearForm: function () {
			for (let property in this.form) {
				this.form[property] = '';
			}
		}
	},
	mounted () {
		this.getAll();
		// get the logged in user to check if admin or staff
		this.loggedUser = JSON.parse(sessionStorage.getItem('user')) || {};
		if (this.loggedUser.type != 1) {
			Swal.fire('Login as admin to edit this collection.', '','info');
		}
	}
}
</script>

<style>

</style>