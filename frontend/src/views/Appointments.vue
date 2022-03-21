<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-4">
				<h1>Appointments</h1>
				<hr>
				<h3 v-if="formType === 'insert'">Add A New Appointment</h3>
				<h3 v-if="formType === 'update'">Update A Appointment</h3>
				<form onsubmit="return false">
					<label for="status">Status</label>
					<select v-model="form.status" id="status" class="form-control">
						<option value="" hidden>Select Status</option>
						<option value="Open">Open</option>
						<option value="Closed">Closed</option>
						<option value="Delayed">Delayed</option>
						<option value="Missed">Missed</option>
						<option value="Cancelled">Cancelled</option>
					</select>
					<label for="location">Location</label>
					<input v-model="form.location" type="text" id="location" class="form-control" placeholder="Location">
					<label for="date">Date</label>
					<input v-model="form.date" type="date" id="date" class="form-control">
					<label for="time">Time</label>
					<select v-model="form.time" id="time" class="form-control">
						<option value="" hidden>Select Time</option>
						<option value="9:00 AM">9:00 AM</option>
						<option value="9:30 AM">9:30 AM</option>
						<option value="10:00 AM">10:00 AM</option>
						<option value="10:30 AM">10:30 AM</option>
						<option value="11:00 AM">11:00 AM</option>
						<option value="11:30 AM">11:30 AM</option>
						<option value="12:00 PM">12:00 PM</option>
						<option value="12:30 PM">12:30 PM</option>
						<option value="1:00 PM">1:00 PM</option>
						<option value="1:30 PM">1:30 PM</option>
						<option value="2:00 PM">2:00 PM</option>
						<option value="2:30 PM">2:30 PM</option>
						<option value="3:00 PM">3:00 PM</option>
						<option value="3:30 PM">3:30 PM</option>
						<option value="4:00 PM">4:00 PM</option>
						<option value="4:30 PM">4:30 PM</option>
						<option value="5:00 PM">5:00 PM</option>
					</select>
					<label for="doctor">Doctor</label>
					<select id="doctor" class="form-control"></select>
					<label for="patient">Patient</label>
					<select id="patient" class="form-control"></select>
					<button v-if="formType === 'insert'" @click="submitInsertClick" class="btn btn-success" type="submit" style="width:100%">Submit</button>
					<button v-if="formType === 'update'" @click="submitUpdateClick" class="btn btn-success" type="submit" style="width:100%">Update</button>
				</form>
			</div>
			<div class="col-lg-8">
				<h1>Appointments Table</h1>
				<hr>
				<table>
					<thead>
						<tr>
							<th>Status</th>
							<th>Location</th>
							<th>Date</th>
							<th>Time</th>
							<th>Doctor</th>
							<th>Patient</th>
						</tr>
					</thead>
					<tr v-for="(appointment, i) in appointments" :key="i">
						<td>{{appointment.status}}</td>
						<td>{{appointment.location}}</td>
						<td>{{appointment.date}}</td>
						<td>{{appointment.time}}</td>
						<td>{{appointment.doctor.first_name}} {{appointment.doctor.last_name}}</td>
						<td>{{appointment.patient.first_name}} {{appointment.patient.last_name}}</td>
						<td>
							<i class="fa fa-refresh" @click="updateIconClick(appointment)"></i>
							<i class="fa fa-trash" @click="deleteIconClick(appointment._id)"></i>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Appointments',
	data() {
		return {
			form: {
				status: '',
				location: '',
				date: '',
				time: '',
				doctor: {},
				patient: {}
			},
			appointments: [],
			doctors: [],
			patients: [],
			formType: 'insert',
			updateID: '',
		}
	},
	methods: {
		getAll: function () {
			let $this = this;
			this.$emit('emit-query', 'Appointments', {}, (err, data) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				$this.appointments = data;
			});
		},
		submitInsertClick: function () {
			if (!this.validateAppointmentDateTime(this.appointments, this.form.date, this.form.time)) {
				Swal.fire('Appointment date and time is not available', '', 'error');
				return;
			}
			if (!this.setDoctorAndPatient()) {
				Swal.fire('Please select a doctor and patient', '', 'error');
				return;
			}
			let $this = this;
			this.$emit('emit-insert', 'Appointments', this.form, (err) => {
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
			let filteredAppointments = this.appointments.filter(appointment => {
				return appointment._id != $this.updateID;
			});
			console.log(filteredAppointments)
			if (!this.validateAppointmentDateTime(filteredAppointments, this.form.date, this.form.time)) {
				Swal.fire('Appointment date and time is not available', '', 'error');
				return;
			}
			if (!this.setDoctorAndPatient()) {
				Swal.fire('Please select a doctor and patient', '', 'error');
				return;
			}
			this.$emit('emit-update', 'Appointments', this.form, this.updateID, (err) => {
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
			$('#doctor').val(document.doctor._id);
			$('#patient').val(document.patient._id);
		},
		deleteIconClick: function (id) {
			let $this = this;
			Swal.fire({
				title: 'Are you sure you want to delete this appointment?',
				showCancelButton: true,
				confirmButtonText: 'Delete'
			}).then(result => {
				if (result.isConfirmed) {
					$this.$emit('emit-delete', 'Appointments', id, (err) => {
						if (err) {
							Swal.fire('Error', err, 'error');
							return;
						}
						let filteredForm = this.appointments.filter(appointment => {
							return appointment._id != id;
						});
						$this.appointments = filteredForm;
					});
				}
			});
		},
		clearForm: function () {
			for (let property in this.form) {
				this.form[property] = '';
			}
			$('#doctor').val('');
			$('#patient').val('');
		},
		setDoctorAndPatient: function () {
			if (!$('#doctor').val() || !$('#patient').val()) {
				return false;
			}
			let $this = this;
			// add selected doctor and patient to form properties
			this.doctors.forEach(doctor => {
				if (doctor._id === $('#doctor').val()) {
					$this.form.doctor = doctor;
					return;
				}	
			});
			this.patients.forEach(patient => {
				if (patient._id === $('#patient').val()) {
					$this.form.patient = patient;
					return;
				}	
			});
			return true;
		},
		// to validate date and time:
		// iterate through the given appointments and check date and time with
		// the form date and time.
		// passing appointments parameter allows this to work when updating appoinments because
		// the apointment being updated can be removed from the appoinments being checked
		validateAppointmentDateTime: function (appointments, date, time) {
			let validation = true;
			appointments.forEach(appointment => {
				if (appointment.date == date && appointment.time == time) {
					validation = false;
					return;
				}
			});
			return validation;
		}
	},
	mounted () {
		// get all appointments
		this.getAll();
		// get doctors and patients and
		// add options to select elements
		let $this = this;
		$('#doctor').html('<option value="" hidden>Select Doctor</option>');
		$('#patient').html('<option value="" hidden>Select Patient</option>');
		this.$emit('emit-query', 'Doctors', {}, (err, data) => {
			if (err) {
				console.error('Error getting doctors');
				return;
			}
			$this.doctors = data;
			let doctorNames = '';
			$this.doctors.forEach(doctor => {
				doctorNames += `<option value='${doctor._id}'>${doctor.first_name} ${doctor.last_name}</option>`;
			});
			$('#doctor').append(doctorNames);
		});
		this.$emit('emit-query', 'Patients', {}, (err, data) => {
			if (err) {
				console.error('Error getting patients');
				return;
			}
			$this.patients = data;
			let patientNames = '';
			$this.patients.forEach(patient => {
				patientNames += `<option value='${patient._id}'>${patient.first_name} ${patient.last_name}</option>`;
			});
			$('#patient').append(patientNames);
		});
	}
}
</script>

<style>

</style>