<template>
	<div class="container" v-if="loggedUser.type">
		<div class="row">
			<div class="col-lg-4">
				<Box title="User Account" hr>
					<h3>Edit Your Credentials</h3>
					<button @click="usernameForm" class="btn btn-primary">Change Username</button>
					<button @click="passwordForm" class="btn btn-primary">Change Password</button>
				</Box>
				<Box title="Your Information" hr>
					<p><strong>Username: </strong>{{loggedUser.username}}</p>
					<p><strong>Account Type: </strong>{{loggedUser.type==='1'?'Admin':'Staff'}}</p>
					<router-link to="/">
						<button class="btn btn-primary">
							Back To Home
						</button>
					</router-link>
				</Box>
			</div>
			<div class="col-lg-8">
				<form v-if="formType === 'username'" onsubmit="return false">
					<Box title="Change Username" hr>
						<label for="username">Enter New Username</label>
						<input v-model="loggedUser.username" type="text" id="username" class="form-control">
						<button @click="changeUsername" class="btn btn-success">Change Username</button>
					</Box>
				</form>
				<form v-if="formType === 'password'" onsubmit="return false">
					<Box title="Change Password" hr>
						<label for="oldPassword">Enter Old Password</label>
						<input type="text" id="oldPassword" class="form-control">
						<label for="newPassword">Enter New Password</label>
						<input type="password" id="newPassword" class="form-control">
						<button @click="changePassword" class="btn btn-success">Change Password</button>
					</Box>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import Box from "@/components/Box"
export default {
	name: 'Users',
	components: {
		Box
	},
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
			this.loggedUser.personalAccount = {};
			this.loggedUser.personalAccount.changeUsername = true;
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
			if (!$('#newPassword').val().trim() || !$('#oldPassword').val().trim()) {
				Swal.fire('Password can not be empty', '', 'error');
				return;
			}
			this.loggedUser.oldPassword = $('#oldPassword').val();
			this.loggedUser.password = $('#newPassword').val();
			this.loggedUser.personalAccount = {};
			this.loggedUser.personalAccount.changePassword = true;
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
		// get logged user
		this.loggedUser = JSON.parse(sessionStorage.getItem('user')) || {};
        if (!this.loggedUser.type) {
            Swal.fire('You are not logged in.', '','info');
		}
	}
}
</script>

<style scoped>
.btn-primary {	
	width: 100%;
}
</style>