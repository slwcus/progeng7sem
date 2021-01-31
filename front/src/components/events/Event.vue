<template>
	<v-container>
		<datepicker :show="showPicker" v-model="tempEvent[dateModel]" @close-picker="showPicker = false" :start="dateFrom"/>
		<v-row>
			<v-col>
	<v-card class="mx-auto my-auto">
		<v-card-title>Events \ {{event.title}}
			<v-spacer/>
			<v-btn @click="deleteEvent" v-if="$store.state.user.role == 0" icon><v-icon >mdi-delete</v-icon></v-btn>
		</v-card-title>
		<v-container>
			<v-row>
				<v-col xs="auto">
					<v-card v-if="!eventInfoEdit">
						<v-card-title>Event Information<v-spacer/><v-btn icon @click="toggleEdit('eventInfoEdit')"><v-icon>$edit</v-icon></v-btn></v-card-title>
						<v-card-text>
							<p><span class="font-weight-medium">Title: </span>
								{{event.title}}
							</p>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Event information edit</v-card-title>
						<v-card-text>
							<v-container>
								<v-row dense>
									<v-col>
										<v-text-field 
											label="Event Title" 
											v-model="tempEvent.title" 
											outlined dense
											required
											:error-messages="$getErrorMessage($v.tempEvent.title, 'Event Title')"
											></v-text-field>
									</v-col>
							</v-row>
							<v-btn @click="edit(true)">OK</v-btn><v-btn @click="cancelEdit">cancel</v-btn>
							</v-container>
						</v-card-text>
					</v-card>
					<v-card v-if="!datesInfoEdit">
						<v-card-title>Dates information<v-spacer/>
							<v-btn icon @click="toggleEdit('datesInfoEdit')"><v-icon>$edit</v-icon></v-btn>
						</v-card-title>
						<v-card-text>
							<p><span class="font-weight-medium">Start date: </span>{{getLocalDate(event.start_date)}}</p>
							<p><span class="font-weight-medium">C1 date: </span>{{getLocalDate(event.c1_date)}}</p>
							<p><span class="font-weight-medium">C+1 date: </span>{{getLocalDate(event.cplus_date)}}</p>
							<p><span class="font-weight-medium">Finish date: </span>{{getLocalDate(event.finish_date)}}</p>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Dates information edit</v-card-title>
						<v-card-text>
							<v-container>
							<v-row>
								<template  v-for="(item,index) in getDays(tempEvent)">
								<v-sheet
									:key="item.day"
						          class="d-flex flex-column"
						          :color="item.color"
						        >
						        	<div class="pa-1">{{item.date}}</div>
						          <v-divider color="white"></v-divider>
						            <div class="pa-1" style="border-bottom: 2px solid white">{{item.day}}</div>
						        </v-sheet>
						        <v-divider :key="index" vertical></v-divider>
						        </template>
							</v-row>
							<v-row dense class="mt-3">
								<v-col>
									<v-text-field
							            v-model="tempEvent.start_date"
							            label="Start Date"
							           prepend-inner-icon="mdi-calendar"
							            readonly
							            outlined
							            :error-messages="$getErrorMessage($v.tempEvent.start_date, 'Start Date')"
							            dense
							            @click="initPicker('start_date')"
							          ></v-text-field>
							          <v-text-field
							            v-model="tempEvent.c1_date"
							            label="C1 Date"
							            prepend-inner-icon="mdi-calendar"
							            readonly
							            outlined
							            :disabled="!tempEvent.start_date"
							            dense
							             :error-messages="$getErrorMessage($v.tempEvent.c1_date, 'C1 Date')"
							            @click="initPicker('c1_date',getNextDay(tempEvent.start_date))"
							          ></v-text-field>
							          <v-text-field
							            v-model="tempEvent.cplus_date"
							            label="C+1 Date"
							            prepend-inner-icon="mdi-calendar"
							            readonly
							            outlined
							            dense
							            :disabled="!tempEvent.c1_date"
							             :error-messages="$getErrorMessage($v.tempEvent.cplus_date, 'C+1 Date')"
							             @click="initPicker('cplus_date',getNextDay(tempEvent.c1_date))"
							          ></v-text-field>
							          <v-text-field
							            v-model="tempEvent.finish_date"
							            label="Finish Date"
							            prepend-inner-icon="mdi-calendar"
							            readonly
							            outlined
							            :disabled="!tempEvent.cplus_date"
							            dense
							             :error-messages="$getErrorMessage($v.tempEvent.finish_date, 'Finish Date')"
							             @click="initPicker('finish_date',getNextDay(tempEvent.cplus_date))"
							          ></v-text-field>
								</v-col>
							</v-row>
							<v-btn @click="edit">OK</v-btn><v-btn @click="cancelEdit">cancel</v-btn>
							</v-container>
						</v-card-text>
					</v-card>
					<v-card >
						<v-card-title>Participants</v-card-title>
						<v-card-text>
							<p class="d-flex"><span class="font-weight-medium">Participants: </span>{{event.participants.length}}
								<v-spacer></v-spacer> <v-btn color="wwarning" :to="`/users?event_id=${$route.params.id}`">Assign</v-btn></p>
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
	import { required} from 'vuelidate/lib/validators'
	
	export default {
		validations: {
			tempEvent: {
			    title: {
			      required,
			    },
			    start_date: {
			    	required
			    },
			    cplus_date:{
			    	required
			    },
			    c1_date:{
			    	required
			    },
			    finish_date: {
			    	required
			    }
			}
		},
		data: () => ({
			showPicker: false,
			dateModel: null,
			dateFrom: '',
			event: {
				title: 'sdasdads',
				start_date: '',
				c1_date:'',
				cplus_date:'',
				finish_date: '',
				participants: []
			},
			tempEvent: {
				title: 'sdasdads',
				start_date: '',
				c1_date:'',
				cplus_date:'',
				finish_date: '',
			},
			eventInfoEdit: false,
			datesInfoEdit: false,
		}),
		watch: {
			tempEvent: {
				handler: function(val, oldVal){
					if(val.start_date >= val.c1_date && val.c1_date){
						val.c1_date = null
					}
					if(val.c1_date >= val.cplus_date && val.cplus_date){
						val.cplus_date = null
					}
					if(val.cplus_date >= val.finish_date && val.finish_date){
						val.finish_date = null
					}
				},
				deep: true
			}
		},
		methods: {
			deleteEvent(){
				this.$http.delete(`${this.$constants.API_URL}/events/${this.$route.params.id}`)
					.then(res => {
						this.$router.go(-1)
					}).catch(err => console.log(err))
			},
			getLocalDate(dateString){
				const date = new Date(dateString)
				return date.toLocaleDateString()
			},
			toggleEdit(fieldName){
				if(!this[fieldName]){
					this.cancelEdit()
				}
				this[fieldName] = !this[fieldName]
			},
			cancelEdit(){
				this.tempEvent = this.event
				this.eventInfoEdit = false
				this.datesInfoEdit = false
			},
			edit(){
				this.$v.tempEvent.$touch()
				if(!this.$v.tempEvent.$anyError){
					this.$http.put(`${this.$constants.API_URL}/events/${this.$route.params.id}`, this.tempEvent)
					.then(res => {
						this.event = this.tempEvent
						this.cancelEdit()
					}).catch(err => console.log(err))
				}
			},
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
			getDays(event){
				let days = []

				
				if(!event || !event.start_date || !event.c1_date || !event.cplus_date || !event.finish_date){
					return days
				}

				const start = new Date(event.start_date)
				const c1 = new Date(event.c1_date)
    			const cPlus = new Date(event.cplus_date)
    			const finish = new Date(event.finish_date)

    			let tempDate = new Date()


    			for(let i = this.dateDiff(c1 - start);i > 0 ; i--){
    				tempDate.setDate(c1.getDate() - i)
    				days.push({day:`C-${i}`, date: tempDate.toLocaleDateString(), color: 'warning'})
    			}

    			for(let i = 1; i <= this.dateDiff(cPlus - c1); i++){
    				tempDate.setDate(c1.getDate() + (i-1))
    				days.push({day:`C${i}`, date: tempDate.toLocaleDateString(), color: 'success'})
    			}

    			for(let i = 0; i <= this.dateDiff(finish - cPlus); i++){
    				tempDate.setDate(cPlus.getDate() + i)
    				days.push({day:`C+${i+1}`,date: tempDate.toLocaleDateString(), color: 'primary'})
    			}

    			return days

			},
			dateDiff(milliseconds){
				return milliseconds/(1000*60*60*24)
			},
		},
		created(){
			console.log(this.$attrs.id)
			
			this.cancelEdit()
			this.$http.get(`${this.$constants.API_URL}/events/${this.$attrs.id}`)
	          .then(res => {
	          	this.event = res.data
	          })
	          .catch(err => {
	            console.log(err)
	          })
		},
	}
</script>