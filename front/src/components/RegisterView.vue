<template>
	<v-card width="550" class="mx-auto my-auto">
		<v-card-title>Sign Up</v-card-title>
		<v-container>
			<v-row>
				<v-col class="pa-4">
					<v-text-field 
						label="Frist Name" 
						v-model="firstName" 
						outlined dense
						required
						:error-messages="getErrorMessage($v.firstName, 'Frist Name')"
						 @input="$v.firstName.$touch()"
		  				@blur="$v.firstName.$touch()"
						></v-text-field>
					<v-text-field 
						label="Last Name" outlined dense
						v-model="lastName"
						:error-messages="getErrorMessage($v.lastName, 'Last Name')"
					 	@input="$v.lastName.$touch()"
		  				@blur="$v.lastName.$touch()"
					></v-text-field>
					<v-autocomplete 
						label="Country" outlined dense
						item-text="name"
		        		item-value="alpha3Code"
		        		v-model="country"
				        :items="countries"
				        :loading="isLoading"
				        :search-input.sync="search"
				        :error-messages="getErrorMessage($v.country, 'Country')"
						 @input="$v.country.$touch()"
		  				@blur="$v.country.$touch()"
					></v-autocomplete>
					<v-autocomplete 
					v-if="country =='RUS'"
						label="Country Region" outlined dense
						item-text="adminName1"
		        		item-value="adminCodes1.ISO3166_2"
		        		v-model="countryRegion"
		        		:items="countryRegions"
		        		:loading="isLoading"
				        :search-input.sync="searchRegion"
				        :error-messages="getErrorMessage($v.countryRegion, 'Country Region')"
						 @input="$v.countryRegion.$touch()"
		  				@blur="$v.countryRegion.$touch()"
					></v-autocomplete>
					<v-text-field 
						label="Email" outlined dense
						v-model="email"
						:error-messages="getErrorMessage($v.email, 'Email')"
					 	@input="$v.email.$touch()"
		  				@blur="$v.email.$touch()"
					></v-text-field>
					<v-text-field 
						label="Password" 
						outlined dense type="password"
		            	:append-icon="showpass1 ? 'mdi-eye' : 'mdi-eye-off'"
		            	:type="showpass1 ? 'text' : 'password'"            
		            	@click:append="showpass1 = !showpass1"
		            	v-model="password"
		            	:error-messages="getErrorMessage($v.password, 'Password')"
					 	@input="$v.password.$touch()"
		  				@blur="$v.password.$touch()"
	            	></v-text-field>
	            	<v-text-field 
						label="Repeat password" 
						outlined dense type="password"
		            	:append-icon="showpass2 ? 'mdi-eye' : 'mdi-eye-off'"
		            	:type="showpass2 ? 'text' : 'password'"            
		            	@click:append="showpass2 = !showpass2"
		            	v-model="passwordRepeat"
		            	:error-messages="getErrorMessage($v.passwordRepeat, 'Repeat password')"
					 	@input="$v.passwordRepeat.$touch()"
		  				@blur="$v.passwordRepeat.$touch()"
	            	></v-text-field>
				</v-col>
			</v-row>
		</v-container>
		<v-card-actions>
			<v-btn text @click="submitRegistration">OK</v-btn>
			<v-btn text to="/">Cancel</v-btn>
			<v-spacer></v-spacer>
			<v-btn v-if="needConfirm" color="warning" text @click="confirmEmail">Confirm Email</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script>
	import { validationMixin } from 'vuelidate'
	import { required,sameAs, helpers} from 'vuelidate/lib/validators'
	import axios from 'axios';

	const regionRequired = (value, vm) => {
		if(vm.country == 'RUS'){
			return helpers.req(value)
		}
		return true
	}
	export default {

		 mixins: [validationMixin],
		 validations: {
		    firstName: {
		      required,
		    },
		    lastName: {
		    	required
		    },
		    country:{
		    	required
		    },
		    email: {
		    	required
		    },
		    password: {
		    	required
		    },
		    passwordRepeat: {
		    	required,
		    	sameAsPassword: sameAs('password')
		    },
		    countryRegion: {
		    	regionRequired
		    }

		  },
		data: () => ({
			avatar: '',
			needConfirm: false,
			showpass1: false,
			showpass2: false,
			firstName: '',
			lastName: '',
			isLoading: false,
			countries: [],
			search: null,
			country:'',
			password: '',
			passwordRepeat: '',
			email: '',
			countryRegions: [],
			countryRegion: null,
			searchRegion: null,
		}),
		methods: {
			
			confirmEmail(){
				this.$router.push({name: 'confirmation', params: {email: this.email}})
			},
			submitRegistration(){
				this.$v.$touch()
				if(!this.$v.$error){
					this.$store.dispatch('register' , {
						first_name: this.firstName,
						last_name: this.lastName,
						email: this.email,
						country: this.country,
						country_region: this.countryRegion,
						password: this.password,
		
					}).then(() => {
						this.$router.push({name: 'confirmation', params: {email: this.email}})
					}).catch(err => {
						this.$root.$children[0].showSnackbar(err.response.data || err.message, 'error')
						if(err.response.status == 530){
							this.needConfirm = true
						}
					})
				}
			},
			getErrorMessage(errorsObj, fieldName){
				
				
				const errors = []
		        if (!errorsObj.$dirty) return errors


		       if(typeof errorsObj.maxLength !== 'undefined'){
		        	!errorsObj.maxLength && errors.push(`${fieldName} must be at most 10 characters long`)
		    	}
		        if(typeof errorsObj.required !== 'undefined') { 
		        	!errorsObj.required && errors.push(`${fieldName} is required.`)
		    	}
		    	if(typeof errorsObj.sameAsPassword !== 'undefined'){
		    		!errorsObj.sameAsPassword && errors.push('Passwords must be identical.')
		    	}
		    	if(typeof errorsObj.regionRequired !== 'undefined'){
		    		
		    		!errorsObj.regionRequired && errors.push(`${fieldName} is required.`)
		    	}
		        return errors
			}
		},
		 watch: {
		 	searchRegion(val){
		 		 if (this.countryRegions.length > 0) return

	        // Items have already been requested
	        if (this.isLoading) return

	        this.isLoading = true

	        // Lazily load input items

	        axios.get('http://api.geonames.org/childrenJSON?geonameId=2017370&username=slwcus',{ transformRequest: (data, headers) => {
   					delete headers.common['Authorization'];
  			}}).then(res => {
	          	this.countryRegions = res.data.geonames
	          	console.log(res.data.geonames)
	            //const { count, entries } = res
	            //this.count = count
	            //this.entries = entries
	          })
	          .catch(err => {
	            console.log(err)
	          })
	          .finally(() => (this.isLoading = false))
		 	},
	      search (val) {
	        // Items have already been loaded
	        if (this.countries.length > 0) return

	        // Items have already been requested
	        if (this.isLoading) return

	        this.isLoading = true

	        // Lazily load input items

	        axios.get('https://restcountries.eu/rest/v2/all',{ transformRequest: (data, headers) => {
   					delete headers.common['Authorization'];
  			}})
	          .then(res => {
	          	this.countries = res.data
	            //const { count, entries } = res
	            //this.count = count
	            //this.entries = entries
	          })
	          .catch(err => {
	            console.log(err)
	          })
	          .finally(() => (this.isLoading = false))
	      },
    	},
	}
</script>