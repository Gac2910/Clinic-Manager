<template>
    <div class="container">
		<div class="row">
			<div class="col-lg-6">
				<Box title="Welcome To My Clinic Manager" hr>
					<h3>Login as staff or admin to view or manage data.</h3>
					<p>
						(Staff Username: Tom) <br>
						(Staff Password: 123)
					</p>
					<p>
						(Admin Username: Bob) <br>
						(Admin Password: 1234)
					</p>
				</Box>
			</div>
			<div class="col-lg-6">
				<Box :title="user.type == undefined ? 'Login' : `Welcome ${user.username}`" hr>
					<form onsubmit="return false" v-if="user.type == undefined">
						<div class="row" >
							<div class="col-md-6">
								<input v-model="form.username" type="text" id="input-username" placeholder="Enter username">
							</div>
							<div class="col-md-6">
								<input v-model="form.password" type="password" id="input-password" placeholder="Enter password">
							</div>
						</div>
						<div class="row">
							<div class="col-12">
								<button @click="login" class="btn btn-success" type="submit">Login</button>
							</div>
						</div>
					</form>
					<div class="row" v-if="user.type === '0' || user.type === '1'">
						<div class="col-12">
							<h1>Account Options</h1>
							<button @click="logout" class="btn btn-danger">Logout</button>
							<router-link to="/User">
								<button class="btn btn-primary">My Account</button>
							</router-link>
						</div>
					</div>
				</Box>	
			</div>
		</div>
    </div>
</template>

<script>
import Box from "@/components/Box"
export default {
	name: 'Home',
	components: {
		Box
	},
	data() {
		return {
			form: {
				username: '',
				password: '',
			},
			user: {}
		}
	},
	methods: {
		login: function () {
			let $this = this;
			$.ajax({
                type: 'POST',
                url: `${baseURL}/login`,
                data: {username: this.form.username, password: this.form.password},
                success: function (data, status) {
                    if (status === 'success') {
						data = JSON.parse(data);
						sessionStorage.setItem('user', JSON.stringify(data));
						$this.user = data;
						// $this.loginTitle = `Welcome ${$this.user.username}`;
						$this.$emit('emit-login-status', $this.user.type);
                    }
                },
                error: function (xhr) {
                    Swal.fire('Error', 'Username or password incorrect.', 'error');
                }
            });
		},
		logout: function () {
			this.form.username = '';
			this.form.password = '';
			this.user = {};
			// this.loginTitle = 'Login';
			this.$emit('emit-login-status', '');
			sessionStorage.removeItem('user');
		}
	},
	mounted() {
		this.user = JSON.parse(sessionStorage.getItem('user')) || {};
	}
}
</script>

<style>
.btn {
	margin: 5px;
}
</style>