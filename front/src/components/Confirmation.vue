<template>
	<v-card width="400" class="mx-auto my-auto">
		<v-card-title>Confirm your email</v-card-title>
		<div class="pa-4">
			{{message}}
		</div>
		<v-card-actions>
			<v-btn text @click="sendLink">Send link again</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script>
	export default {
		params: ['email'],
		data: () => ({
			message: "Confirm link was sent. Send it again?"
		}),
		mounted(){
			if(this.$attrs.email){
				this.$http.post(`${this.$constants.API_URL}/users/confirm`, {email: this.$attrs.email})
			}
			document.addEventListener("visibilitychange", () => {
			  if (document.visibilityState === 'visible') {
			   this.$store.dispatch('refresh').then(() => this.$router.push('/')).catch(err => console.log(err))
			  }
			});
		},
		destroyed(){
			document.removeEventListener("visibilitychange")
		},
		methods: {
			sendLink() {
		   		/*let email = this.email 
		   		let password = this.password
		   		this.$store.dispatch('login', { email, password })
		   		.then(() => this.$router.push('/'))
		   		.catch(err => {
		   			console.log(this.$root.$children[0])
		   			this.$root.$children[0].showSnackbar(err.response.data || err.message, 'error')
		   		})
		   		*/
		   	}
		}
	}
</script>