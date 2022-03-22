<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-2">
				<h2>
					<router-link to="/">
						Clinic
					</router-link>
				</h2>
			</div>
			<div class="col-sm-10" v-if="type">
				<nav>
					<router-link to="/">
						<button class="btn">Home</button>
					</router-link>
					<router-link to="/Patients">
						<button class="btn">Patients</button>
					</router-link>
					<router-link to="/Appointments">
						<button class="btn">Appointments</button>
					</router-link>
					<router-link to="/Doctors">
						<button class="btn">Doctors</button>
					</router-link>
					<router-link to="/AllUsers" v-if="type === '1'">
						<button class="btn">All Users</button>
					</router-link>
				</nav>
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
		background: rgb(0, 0, 0);
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
		background: transparent;
		color: white;
	}
	.btn:hover {
		background: rgba(255, 255, 255, 0.25);
		border-bottom: 1px solid white;
	}
	.adminBanner {
		background-color: rgb(211, 71, 71)
	}
	.staffBanner {
		background-color: #0eaac9;
	}
	.row p {
		margin: 0;
		font-size: 20px;
	}
	nav {
		float: right;
	}
</style>