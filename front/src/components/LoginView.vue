<template>
	<v-card width="400" class="mx-auto my-auto">
		<v-card-title>Sign in</v-card-title>
		<div class="pa-4">
		<v-text-field v-model="email" label="email" required outlined dense 
		:error-messages="$getErrorMessage($v.email, 'Email')"></v-text-field>
		<v-text-field v-model="password" type="password" required label="password" outlined dense
		:error-messages="$getErrorMessage($v.password, 'Password')"></v-text-field>
		</div>
		<v-card-actions>
			<v-btn text @click="login">Sign In</v-btn>
			<v-btn text to="registration">Sign Up</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script>
	import { required} from 'vuelidate/lib/validators'
	export default {
		data: () => ({
			email: '',
			password: ''
		}),
		validations: {
			email: { required},
			password: {required},
		},
		methods: {
			login() {
				this.$v.$touch()
				if(!this.$v.$error){
			   		let email = this.email 
			   		let password = this.password
			   		this.$store.dispatch('login', { email, password })
			   		.then(() => this.$router.push('/'))
			   		.catch(err => {
			   			console.log(this.$root.$children[0])
			   			this.$root.$children[0].showSnackbar(err.response.data || err.message, 'error')
			   		})
		   		}
		   	}
		}
	}
</script>