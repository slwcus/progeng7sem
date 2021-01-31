<template>
	<v-card width="550" class="mx-auto my-auto">
		<datepicker :show="showPicker" v-model="dates[dateModel]" @close-picker="showPicker = false" :start="dateFrom"/>
		<v-card-title>New Event</v-card-title>
		<v-container>
			<v-row>
				<v-col class="pa-4">
					<v-text-field 
						label="Event Title" 
						v-model="eventTitle" 
						outlined dense
						required
						:error-messages="$getErrorMessage($v.eventTitle, 'Event Title')"
						 @input="$v.eventTitle.$touch()"
		  				@blur="$v.eventTitle.$touch()"
						></v-text-field>
					<v-text-field
			            v-model="dates.start"
			            label="Start Date"
			           prepend-inner-icon="mdi-calendar"
			            readonly
			            outlined
			            :error-messages="$getErrorMessage($v.dates.start, 'Start Date')"
			            dense
			            @click="initPicker('start')"
			          ></v-text-field>
			          <v-text-field
			            v-model="dates.c1"
			            label="Picker in menu"
			            prepend-inner-icon="mdi-calendar"
			            readonly
			            outlined
			            :disabled="!dates.start"
			            dense
			             :error-messages="$getErrorMessage($v.dates.c1, 'C1 Date')"
			            @click="initPicker('c1',getNextDay(dates.start))"
			          ></v-text-field>
			          <v-text-field
			            v-model="dates.cPlus"
			            label="Picker in menu"
			            prepend-inner-icon="mdi-calendar"
			            readonly
			            outlined
			            dense
			            :disabled="!dates.c1"
			             :error-messages="$getErrorMessage($v.dates.cPlus, 'C+1 Date')"
			             @click="initPicker('cPlus',getNextDay(dates.c1))"
			          ></v-text-field>
			          <v-text-field
			            v-model="dates.finish"
			            label="Picker in menu"
			            prepend-inner-icon="mdi-calendar"
			            readonly
			            outlined
			            :disabled="!dates.cPlus"
			            dense
			             :error-messages="$getErrorMessage($v.dates.finish, 'Finish Date')"
			             @click="initPicker('finish',getNextDay(dates.cPlus))"
			          ></v-text-field>
				</v-col>
			</v-row>
		</v-container>
		<v-card-actions>
			<v-btn text @click="createEvent">OK</v-btn>
			<v-btn text to="/events">Cancel</v-btn>
		</v-card-actions>
	</v-card>
</template>
<script>
	import { validationMixin } from 'vuelidate'
	import { required,sameAs, helpers} from 'vuelidate/lib/validators'
	import axios from 'axios';

	
	export default {

		 mixins: [validationMixin],
		 validations: {
		    eventTitle: {
		      required,
		    },
		    dates: {
		    	start: {
		    		required
		    	},
		    	c1: {
		    		required
		    	},
		    	cPlus: {
		    		required
		    	},
		    	finish: {
		    		required
		    	}
		    }
		  },
		data: () => ({
			eventTitle: '',
			dates: {
				start : null,
				c1: null,
				cPlus: null,
				finish: null
			},
			showPicker: false,
			date: null, 
			dateFrom: '',
			dateTo: '',
			dateModel: null
		}),
		watch: {
			dates: {
				handler: function(val, oldVal){
					if(val.start >= val.c1 && val.c1){
						val.c1 = null
					}
					if(val.c1 >= val.cPlus && val.cPlus){
						val.cPlus = null
					}
					if(val.cPlus >= val.finish && val.finish){
						val.finish = null
					}
				},
				deep: true
			}
		},
		methods: {
			getNextDay(ISODate){
				let date = new Date(ISODate)
				date.setDate(date.getDate() + 1)
				return date.toISOString()
			},
			initPicker(model,dateFrom = null,dateTo = ''){
				this.dateModel = model
				this.dateTo = dateTo
				if(!dateFrom){
					const date = new Date()
					this.dateFrom = date.toISOString()
				} else {
					this.dateFrom = dateFrom
				}
				this.showPicker = true
			},
			createEvent(){
				this.$v.$touch()
				if(!this.$v.$error){
					this.$http.post(`${this.$constants.API_URL}/events`, {
						title: this.eventTitle,
						start_date: new Date(this.dates.start),
						c1_date: new Date(this.dates.c1),
						cplus_date: new Date(this.dates.cPlus),
						finish_date: new Date(this.dates.finish)
					}).then(res => {
						this.$router.push('/events')
					}).catch(err => {
						console.log(err)
					})
				}
			}
			
		}
	}
</script>