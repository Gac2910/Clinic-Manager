<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-4">
				<h1>Patients</h1>
				<hr>
				<h3 v-if="formType === 'insert'">Add A New Patient</h3>
				<h3 v-if="formType === 'update'">Update A Patient</h3>
				<form onsubmit="return false">
					<label for="first_name">First Name</label>
					<input v-model="form.first_name" type="text" id="first_name" class="form-control" placeholder="First Name">
					<label for="last_name">Last Name</label>
					<input v-model="form.last_name" type="text" id="last_name" class="form-control" placeholder="Last Name">
					<label for="sex">Sex</label>
					<select v-model="form.sex" id="sex" class="form-control">
						<option value="" hidden>Select Sex</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Non-Binary">Non-Binary</option>
					</select>
					<label for="address">Address</label>
					<input v-model="form.address" type="text" id="adress" class="form-control" placeholder="Address">
					<label for="zip_code">Zip Code</label>
					<input v-model="form.zip_code" type="text" id="zip_code" class="form-control" placeholder="Zip Code">
					<label for="phone_number">Phone Number</label>
					<input v-model="form.phone_number" type="tel" id="phone_number" class="form-control" placeholder="Phone Number">
					<label for="birth_date">Birth Date</label>
					<input v-model="form.birth_date" type="date" id="birth_date" class="form-control" placeholder="Birth Date">
					<button v-if="formType === 'insert'" @click="submitInsertClick" class="btn btn-success" type="submit" style="width:100%">Submit</button>
					<button v-if="formType === 'update'" @click="submitUpdateClick" class="btn btn-success" type="submit" style="width:100%">Update</button>
				</form>
			</div>
			<div class="col-lg-8">
				<h1>Patients Table</h1>
				<hr>
				<table>
					<thead>
						<tr>
							<th>Full Name</th>
							<th>Sex</th>
							<th>Address</th>
							<th>Zip Code</th>
							<th>Phone Number</th>
							<th>Birth Date</th>
						</tr>
					</thead>
					<tr v-for="(patient, i) in patients" :key="i">
						<td>{{patient.first_name}} {{patient.last_name}}</td>
						<td>{{patient.sex}}</td>
						<td>{{patient.address}}</td>
						<td>{{patient.zip_code}}</td>
						<td>{{patient.phone_number}}</td>
						<td>{{patient.birth_date}}</td>
						<td>
							<i class="fa fa-refresh" @click="updateIconClick(patient)"></i>
							<i class="fa fa-trash" @click="deleteIconClick(patient._id)"></i>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Patients',
	data() {
		return {
			form: {
				first_name: '',
				last_name: '',
				sex: '',
				address: '',
				zip_code: '',
				phone_number: '',
				birth_date: ''
			},
			patients: [],
			formType: 'insert',
			updateID: '',
		}
	},
	methods: {
		getAll: function () {
			let $this = this;
			this.$emit('emit-query', 'Patients', {}, (err, data) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				$this.patients = data;
			});
		},
		submitInsertClick: function () {
			let $this = this;
			this.$emit('emit-insert', 'Patients', this.form, (err) => {
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
			this.$emit('emit-update', 'Patients', this.form, this.updateID, (err) => {
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
					$this.$emit('emit-delete', 'Patients', id, (err) => {
						if (err) {
							Swal.fire('Error', err, 'error');
							return;
						}
						let filteredForm = this.patients.filter(patient => {
							return patient._id != id;
						});
						$this.patients = filteredForm;
					});
				}
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
	}
}
</script>

<style>

</style>