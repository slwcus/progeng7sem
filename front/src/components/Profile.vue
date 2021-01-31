<template>
	<v-container>
		<v-row>
			<v-col>
	<v-card class="mx-auto my-auto">
		<v-card-title>Profile 
			<v-spacer/>
			<template v-if=false>
			<v-avatar size="36" class="d-sm-none">
			<v-img  class="mx-auto" src="1"></v-img>
			</v-avatar>
					<v-btn class="d-sm-none" icon><v-icon>mdi-upload</v-icon></v-btn>
					<v-btn class="d-sm-none" icon><v-icon>mdi-delete</v-icon></v-btn>
				</template>
		</v-card-title>
		<v-container>
			<v-row>

				<v-col v-if=false sm="2" class="d-none d-sm-block">

					<v-img height="80" width="80" class="mx-auto" :src="avatar"></v-img>
					<input v-show=false ref="avatar" type="file" @change="addAvatar($event)">
					<v-btn @click="pickFile">Upload</v-btn>
					<v-btn @click="removeAvatar">Delete</v-btn>
				</v-col>
				<v-col xs="auto">
					<v-card v-if="!loginEdit">
						<v-card-title>Login information<v-spacer/><v-btn icon @click="loginEdit = true"><v-icon>$edit</v-icon></v-btn></v-card-title>
						<v-card-text>
							<p><span class="font-weight-medium">Email: </span>
								{{user.email}}
							</p>
							<p><span class="font-weight-medium">Password: **********</span></p>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Login information edit</v-card-title>
						<v-card-text>
							<v-container>
								<v-row dense>
									<span class="font-weight-medium">Email: </span>
									{{user.first_name}}
								</v-row>
							<v-row dense>
								<v-col cols="12" sm="4">Current password</v-col>
								<v-col>
									<v-text-field outlined dense v-model="passwords.password"
										:error-messages="passwordError" @change="checkPassword"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row dense>
								<v-col cols="12" sm="4">New password</v-col>
								<v-col><v-text-field v-model="passwords.new_password" outlined dense
									:error-messages="$getErrorMessage($v.passwords.new_password, 'Password')"
								></v-text-field></v-col>
							</v-row>
							<v-row dense>
								<v-col cols="12" sm="4">Repeat Password</v-col>
								<v-col><v-text-field  v-model="passwords.new_password_repeat" outlined dense
									:error-messages="$getErrorMessage($v.passwords.new_password_repeat, 'Repeat Password')"
								></v-text-field></v-col>
							</v-row>
							<v-btn @click="edit(true)">OK</v-btn><v-btn @click="cancelEdit">cancel</v-btn>
							</v-container>
						</v-card-text>
					</v-card>
					<v-card v-if="!profileInfoEdit">
						<v-card-title>Profile information<v-spacer/>
							<v-btn icon @click="toggleEdit('profileInfoEdit')"><v-icon>$edit</v-icon></v-btn>
						</v-card-title>
						<v-card-text>
							<p><span class="font-weight-medium">First name: </span>{{user.first_name}}</p>
							<p><span class="font-weight-medium">Second name: </span>{{user.last_name}}</p>
							<p><span class="font-weight-medium">Country: </span>{{countryName}} <span v-if="countryRegionName">({{countryRegionName}})</span></p>
							<p><span class="font-weight-medium">About: </span>{{user.about}}</p>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Profile information edit</v-card-title>
						<v-card-text>
							<v-container>
							<v-row dense>
								<v-col>
									<v-text-field outlined dense v-model="tempUser.first_name"
										label="First Name" :error-messages="$getErrorMessage($v.tempUser.first_name, 'First Name')"
									></v-text-field>
									<v-text-field outlined dense v-model="tempUser.last_name"
										label="Last Name" :error-messages="$getErrorMessage($v.tempUser.last_name, 'Last Name')"
									></v-text-field>
									<v-autocomplete 
										label="Country" outlined dense
										item-text="name"
						        		item-value="alpha3Code"
						        		v-model="tempUser.country"
								        :items="countries"
								        :error-messages="$getErrorMessage($v.tempUser.country, 'Country')"
										 @input="$v.tempUser.country.$touch()"
						  				@blur="$v.tempUser.country.$touch()"
									></v-autocomplete>
									<v-autocomplete 
									v-if="tempUser.country =='RUS'"
										label="Country Region" outlined dense
										item-text="adminName1"
						        		item-value="adminCodes1.ISO3166_2"
						        		v-model="tempUser.country_region"
						        		:items="countryRegions"
								        :error-messages="$getErrorMessage($v.tempUser.country_region, 'Country Region')"
										 @input="$v.tempUser.country_region.$touch()"
						  				@blur="$v.tempUser.country_region.$touch()"
									></v-autocomplete>
									<v-textarea outlined dense v-model="tempUser.about"
										label="About"
									></v-textarea>
								</v-col>
							</v-row>
							<v-btn @click="edit">OK</v-btn><v-btn @click="cancelEdit">cancel</v-btn>
							</v-container>
						</v-card-text>
					</v-card>
					<v-card v-if="!pinEdit">
						<v-card-title>Personal identification number</v-card-title>
						<v-card-text>
							<v-row>
								<span class="font-weight-medium">Pin: {{tempUser.pin ? '****' : ''}}</span>
								<v-spacer/>
								<v-btn @click="resetPin" v-if="tempUser.pin">Reset Pin</v-btn>
								<v-btn @click="toggleEdit('pinEdit')" v-else>Set Pin</v-btn>
							</v-row>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Pin Edit</v-card-title>
						<v-card-text>
							<v-container>
							<v-row dense>
								<v-col>
									<v-text-field outlined dense v-model="tempUser.pin"
										label="Pin" counter="4" v-mask="'####'" :error-messages="pinErrors"
									></v-text-field>
								</v-col>
							</v-row>
							<v-btn @click="edit">OK</v-btn><v-btn @click="cancelEdit">cancel</v-btn>
							</v-container>
						</v-card-text>
					</v-card>
					
				</v-col>
			</v-row>
		</v-container>
		<v-card-actions>
		</v-card-actions>
	</v-card>
</v-col>
</v-row>
</v-container>
</template>
<script>
	import { required,sameAs, helpers} from 'vuelidate/lib/validators'
	const regionRequired = (value, vm) => {
		if(vm.country == 'RUS'){
			return helpers.req(value)
		}
		return true
	}
	export default {
		validations: {
			passwords: {
				new_password: {
			    	required
			    },
			    new_password_repeat: {
			    	required,
			    	sameAsPassword: sameAs('new_password')
			    },
			},
			tempUser: {
			    first_name: {
			      required,
			    },
			    last_name: {
			    	required
			    },
			    country:{
			    	required
			    },
			    country_region: {
			    	regionRequired
			    }
			}
		},
		data: () => ({
			countryRegions : [],
			countries: [],
			search: null,
			isLoading: null,
			searchRegion: null,
			passwordError: null,
			pinErrors: null,
			user: null,
			email: '',
			password: '',
			countryName: '',
			countryRegionName: '',
			loginEdit: false,
			profileInfoEdit: false,
			pinEdit: false,
			passwords: {
				old_password: '',
				new_password: '',
				new_password_repeat: ''
			},
			tempUser: {
				first_name: '',
				last_name: '',
				country_region: '',
				country: '',
				pin: '',
				about: ''
			}
		}),
		methods: {
			pickFile(){
				this.$refs.avatar.click()
			},
			addAvatar(event){
				console.log(event.target.files[0])
				var formData = new FormData();
				formData.append("avatar", event.target.files[0]);
				this.$http.post(`${this.$constants.API_URL}/users/${this.$store.state.user.id}/upload`,formData, {
			    headers: {
			      'Content-Type': 'multipart/form-data'
			    }}).then(response => {
		        	console.log(response)
		        }).catch(err => console.log(err))
			},
			removeAvatar(){

			},
		toggleEdit(fieldName){
			if(!this[fieldName]){
				this.cancelEdit()
			}
			this[fieldName] = !this[fieldName]
		},
		cancelEdit(){
			this.tempUser = this.user
			this.$set(this.passwords, 'password', '')
			this.$set(this.passwords, 'new_password', '')
			this.$set(this.passwords, 'new_password_repeat', '')
			this.loginEdit = false
			this.profileInfoEdit = false
			this.pinEdit = false
		},
		resetPin(){
			this.tempUser.pin = ''
			this.edit()
		},
		edit(){

			let isValid = true
			if(this.loginEdit){
				this.$v.passwords.$touch()
				isValid = this.passwords.old_password && !this.$v.passwords.$anyError
				this.passwordError = this.passwords.old_password ? "Password is required" : '' 	
			} else if(this.profileInfoEdit){
				this.$v.tempUser.$touch()
				isValid = !this.$v.tempUser.$anyError
			} else if(this.tempUser.pin) {
				const pin = this.tempUser.pin.match(/^[0-9]{4}/gm)
				if(pin){
					this.tempUser.pin = pin[0]
				} else {
					isValid = false
					this.pinErrors = "Invalid pin"
				}
				//validation for pin
			}
			if(isValid){
				const updateData = Object.assign({}, this.tempUser, {password : this.password.new_password})
				this.$http.put(`${this.$constants.API_URL}/users/${this.tempUser.id}`, updateData)
				.then(res => {
					this.user = this.tempUser
					this.cancelEdit()
				}).catch(err => console.log(err))
			}
		},
		checkPassword(){
			this.$http.put(`${this.$constants.API_URL}/auth/checkpass`, {id: this.user.id, password: this.passwords.old_password}).then(response => this.passwordError = '').catch(err => this.passwordError = err.response.data)
		},
		login() {
		   		let email = this.email 
		   		let password = this.password
		   		this.$store.dispatch('login', { email, password })
		   		.then(() => this.$router.push('/'))
		   		.catch(err => console.log(err))
		   	}
		},
		created(){
			this.user = this.$store.state.user
			this.cancelEdit()
			this.$http.get('https://restcountries.eu/rest/v2/all',{ transformRequest: (data, headers) => {
   					delete headers.common['Authorization'];
  			}})
	          .then(res => {
	          	let countries = res.data
	          	this.countries = countries
	            let country = countries.find((elem) => {

	            	return elem.alpha3Code === this.tempUser.country
	            })
	            this.countryName = country.name
	          })
	          .catch(err => {
	            console.log(err)
	          })
	          .finally(() => (this.isLoading = false))

			 this.$http.get('http://api.geonames.org/childrenJSON?geonameId=2017370&username=slwcus',{ transformRequest: (data, headers) => {
   					delete headers.common['Authorization'];
  			}}).then(res => {
	          	let countryRegions = res.data.geonames
	          	this.countryRegions = countryRegions
	          	let countryRegion = countryRegions.find((elem) => {
	          		 return elem.adminCodes1.ISO3166_2 === this.tempUser.country_region
	          	})
	          	this.countryRegionName = countryRegion.name

	          })
	          .catch(err => {
	            console.log(err)
	          })
		},
	}
</script>