<template>
	<v-container>
		<v-row>
			<v-col>
	<v-card class="mx-auto my-auto">
		<v-card-title>Document \ {{doc.title}}<v-spacer/><v-btn v-if="$store.state.user.role == 0" icon @click="deleteDoc"><v-icon>mdi-delete</v-icon></v-btn></v-card-title>
		<v-container>
			<v-row>
				<v-col xs="auto">
					<v-card v-if="!documentEdit">
						<v-card-title>Document Information<v-spacer/><v-btn v-if="$store.state.user.role == 0" icon @click="toggleEdit('documentEdit')"><v-icon>$edit</v-icon></v-btn></v-card-title>
						<v-card-text>
							<p><span class="font-weight-medium">Title: </span>
								{{doc.title}}
							</p>
							<p><span class="font-weight-medium">Day: </span>
								{{doc.day}}
							</p>
							<p><span class="font-weight-medium">Document Content: </span>
								{{doc.content}}
							</p>
							<p><span class="font-weight-medium">For: </span>
								{{doc.rolename}}
							</p>
						</v-card-text>
					</v-card>
					<v-card v-else>
						<v-card-title>Document Edit</v-card-title>
							<v-container>
								<v-row>
									<v-col class="pa-4">
										<v-text-field 
											label="Document Title" 
											v-model="tempDocument.title" 
											outlined dense
											required
											:error-messages="$getErrorMessage($v.tempDocument.title, 'Document Title')"
										></v-text-field>
										<v-select
											outlined dense
											label="Event"
											v-model="tempDocument.event_id"
											:items="events"
											:item-text="getSummary"
											item-value="_id"
											return-object
											:error-messages="$getErrorMessage($v.tempDocument.event, 'Event')"
										></v-select>
										<v-select
											outlined dense
											label="Day"
											:disabled="!tempDocument.event_id"
											v-model="tempDocument.day" 
											:items="getDays(tempDocument.event_id)"
											:error-messages="$getErrorMessage($v.tempDocument.day, 'Day')"
										></v-select>
										<v-textarea
											outlined dense
											label="Document Content"
											rows="4"
											auto-grow
											v-model="tempDocument.content"
										></v-textarea>
										<v-radio-group
									      v-model="tempDocument.role"
									      column
									      label="For"
									      :error-messages="$getErrorMessage($v.tempDocument.role, 'Role')"
									    >
									      <v-radio
									        label="Experts"
									        :value="2"
									      ></v-radio>
									      <v-radio
									        label="Competitors"
									        :value="3"
									      ></v-radio>
									    </v-radio-group>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions>
								<v-btn text @click="edit">OK</v-btn>
								<v-btn text @click="cancelEdit">Cancel</v-btn>
							</v-card-actions>
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
			tempDocument: {
			    title: {
			      required,
			    },
			    day: {
			    	required
			    },
			    role:{
			    	required
			    },
			    event: {
			    	required
			    }
			}
		},
		data: () => ({
			events: [],
			doc: {
				title: 'sdasdads',
				day: '',
				content: '',
				role: 0,
				event_id: null
			},
			tempDocument: {
				title: 'sdasdads',
				day: '',
				content: '',
				role: 0,
				event_id: null
			},
			documentEdit: false,
		}),
	
		methods: {
			deleteDoc(){
				this.$http.delete(`${this.$constants.API_URL}/documents/${this.$attrs.id}`)
				.then(res => {
					this.$router.go(-1)
				}).catch(err => console.log(err))
			},
			getSummary(event){
				return `${event.title} ${event.start_date}` 
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
				this.tempDocument = this.doc
				this.documentEdit = false
			},
			edit(){
				this.$v.tempDocument.$touch()

				if(!this.$v.tempDocument.$anyError){
					this.$http.put(`${this.$constants.API_URL}/documents/${this.$attrs.id}`, this.tempDocument)
					.then(res => {
						this.doc = this.tempDocument
						this.cancelEdit()
					}).catch(err => console.log(err))
				}
			},
			dateDiff(milliseconds){
				return milliseconds/(1000*60*60*24)
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
		},
		created(){
			this.$http.get(`${this.$constants.API_URL}/utility/roles`).then(response => {
	        	this.roles = response.data.roles
	        	this.$http.get(`${this.$constants.API_URL}/documents/${this.$attrs.id}`)
		          	.then(res => {
		          		this.doc = res.data
		          		this.$set(this.doc, 'rolename', this.roles.find(elem => elem.id == this.doc.role).name)
          			}).catch(err => {
	           	 		console.log(err)
          			})
	        }).catch(err => console.log(err))

			this.$http.get(`${this.$constants.API_URL}/events`).then(response => {
		        this.events = response.data.events
		          console.log(response)
		        }).catch(err => console.log(err))
			
			this.cancelEdit()
			
		},
	}
</script>