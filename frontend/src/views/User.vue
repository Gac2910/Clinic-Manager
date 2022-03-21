<template>
	<div class="container">
		<div class="row">
			<div class="col-lg-4">
				<h1>User Account</h1>
				<hr>
				<h3>Edit Your Credentials</h3>
				<button @click="usernameForm" class="btn btn-success" style="width:100%">Change Username</button>
				<button @click="passwordForm" class="btn btn-success" style="width:100%">Change Password</button>
			</div>
			<div class="col-lg-8">
				<form v-if="formType === 'username'" onsubmit="return false">
					<h1>Change Username</h1>
					<hr>
					<label for="username">Enter New Username</label>
					<input v-model="loggedUser.username" type="text" id="username" class="form-control">
					<button @click="changeUsername" class="btn btn-success" style="width:100%">Change Username</button>
				</form>
				<form v-if="formType === 'password'" onsubmit="return false">
					<h1>Change Password</h1>
					<hr>
					<label for="oldPassword">Enter Old Password</label>
					<input type="text" id="oldPassword" class="form-control">
					<label for="newPassword">Enter New Password</label>
					<input type="password" id="newPassword" class="form-control">
					<button @click="changePassword" class="btn btn-success" style="width:100%">Change Password</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Users',
	data() {
		return {
			loggedUser: {},
			formType: ''
		}
	},
	methods: {
		usernameForm: function () {
			this.formType = 'username';
		},
		passwordForm: function () {
			this.formType = 'password';
		},
		changeUsername: function () {
			if (!this.loggedUser.username.trim()) {
				Swal.fire('Username can not be empty', '', 'error');
				return;
			}
			let $this = this;
			this.$emit('emit-update', 'Users', this.loggedUser, this.loggedUser._id, (err) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				Swal.fire('Updated Successfully', '', 'success');
				sessionStorage.setItem('user', JSON.stringify($this.loggedUser));
			});
		},
		changePassword: function () {
			if ($('#oldPassword').val() != this.loggedUser.password) {
				Swal.fire('Old password is incorrect', '', 'error');
				return;
			}
			if (!$('#newPassword').val().trim()) {
				Swal.fire('Password can not be empty', '', 'error');
				return;
			}
			this.loggedUser.password = $('#newPassword').val();
			let $this = this;
			this.$emit('emit-update', 'Users', this.loggedUser, this.loggedUser._id, (err) => {
				if (err) {
					Swal.fire('Error', err, 'error');
					return;
				}
				Swal.fire('Updated Successfully', '', 'success');
				sessionStorage.setItem('user', JSON.stringify($this.loggedUser));
			});
		}
	},
	mounted () {
		this.loggedUser = JSON.parse(sessionStorage.getItem('user')) || {};
	}
}
</script>

<style>

</style>