<template>
	<v-card width="550" class="mx-auto my-auto">
		<v-card-title>New Document</v-card-title>
		<v-container>
			<v-row>
				<v-col class="pa-4">
					<v-text-field 
						label="Document Title" 
						v-model="title" 
						outlined dense
						required
						:error-messages="$getErrorMessage($v.title, 'Document Title')"
					></v-text-field>
					<v-select
						outlined dense
						label="Event"
						v-model="event"
						:items="events"
						:item-text="getSummary"
						item-value="_id"
						return-object
						:error-messages="$getErrorMessage($v.event, 'Event')"
					></v-select>
					<v-select
						outlined dense
						label="Day"
						:disabled="!event"
						v-model="day" 
						:items="getDays(event)"
						:error-messages="$getErrorMessage($v.day, 'Day')"
					></v-select>
					<v-textarea
						outlined dense
						label="Document Content"
						rows="4"
						auto-grow
						v-model="content"
					></v-textarea>
					<v-radio-group
				      v-model="forRole"
				      column
				      label="For"
				      :error-messages="$getErrorMessage($v.forRole, 'Role')"
				    >
				      <v-radio
				        label="Experts"
				        value="1"
				      ></v-radio>
				      <v-radio
				        label="Competitors"
				        value="2"
				      ></v-radio>
				    </v-radio-group>
				</v-col>
			</v-row>
		</v-container>
		<v-card-actions>
			<v-btn text @click="createDocument">OK</v-btn>
			<v-btn text to="/">Cancel</v-btn>
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
		    title: {
		      required,
		    },
		    event: {
		    	required
		    },
		    day: {
		    	required
		    },
		    forRole: {
		    	required
		    }
		  },
		data: () => ({
			event: null,
			title: null,
			eventId: null,
			day: null,
			content: null,
			forRole: null,
			events: []
		}),
		created(){
			this.$http.get(`${this.$constants.API_URL}/events`).then(response => {
		        this.events = response.data.events
		          console.log(response)
		        }).catch(err => console.log(err))
		    
		},
		methods: {
			getSummary(event){
				return `${event.title} ${event.start_date}` 
			},
			getDays(event){
				let days = []

				if(!event){
					return days
				}

				const start = new Date(event.start_date)
				const c1 = new Date(event.c1_date)
    			const cPlus = new Date(event.cplus_date)
    			const finish = new Date(event.finish_date)


    			for(let i = this.dateDiff(c1 - start);i > 0 ; i--){
    				days.push(`C-${i}`)
    			}

    			for(let i = 1; i <= this.dateDiff(cPlus - c1); i++){
    				days.push(`C${i}`)
    			}

    			for(let i = 0; i <= this.dateDiff(finish - cPlus); i++){
    				days.push(`C+${i+1}`)
    			}

    			return days

			},
			dateDiff(milliseconds){
				return milliseconds/(1000*60*60*24)
			},
			createDocument(){
				this.$v.$touch()
				if(!this.$v.$error){
					console.log(this.eventId)
					this.$http.post(`${this.$constants.API_URL}/documents`, {
						title: this.title,
						event_id: this.event._id,
						day: this.day,
						content: this.content,
						role: this.forRole
					}).then(res => {
						this.$router.push('/documents')
					}).catch(err => {
						console.log(err)
					})
				}
			}
		},
		
	}
</script>