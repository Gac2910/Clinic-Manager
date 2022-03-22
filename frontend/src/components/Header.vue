<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-sm-6">
				<h2>
					<router-link to="/">
						Clinic
					</router-link>
				</h2>
			</div>
			<div class="col-sm-6" v-if="type">
				<router-link to="/">
					<button class="btn btn-light">Home</button>
				</router-link>
				<router-link to="/Patients">
					<button class="btn btn-light">Patients</button>
				</router-link>
				<router-link to="/Appointments">
					<button class="btn btn-light">Appointments</button>
				</router-link>
				<router-link to="/Doctors">
					<button class="btn btn-light">Doctors</button>
				</router-link>
				
			</div>
		</div>	
		<div class="row adminBanner" v-if="type === '1'">
			<p>Admin Account</p>
		</div>
		<div class="row staffBanner" v-if="type === '0'">
			<p>Staff Account</p>
		</div>	
	</div>
</template>

<script>
export default {
	name: 'Header',
	props: {
		type: String
	}
}
</script>

<style scoped>
	.container-fluid {
		background: rgb(78, 78, 78);
		color: white;
	}
	h2 {
		height: 100%;
	}
	h2 a {
		display: block;
		height: 100%;
		width: min-content;
	}
	.btn {
		margin: 5px 5px;
	}
	.adminBanner {
		background-color: red
	}
	.staffBanner {
		background-color: #0dcaf0;
	}
	.row p {
		margin: 0;
		font-size: 20px;
	}
</style>