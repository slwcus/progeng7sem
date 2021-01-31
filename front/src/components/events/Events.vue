<template>
  <v-container>
    <v-row>
      <v-col >
       <v-data-table :headers="headers" :items="events" @click:row="rowClick">
         <template v-slot:item.dates="{ item }">
        {{ toLocalDate(item.start_date)}} - {{toLocalDate(item.finish_date)}}
    </template>
       </v-data-table>
       
       <v-btn to='/new-event'>Add Event</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {

    data: () => ({
      events: [],
      headers: [
        {
          text: 'Event',
          value: 'title'
        },
        {
          text: 'Dates',
          value: 'dates',
        },
        {
          text: 'Participants',
          value: 'participants.length',
        }
      ]
    }),
    
    methods: {
      rowClick(row, data){
        this.$router.push(`/event/${data.item._id}`)
      },
      toLocalDate(dateString){
        const date = new Date(dateString)
        return date.toLocaleDateString("RU-ru")
      },
      sortEvents(events){
        const today = new Date()
        const activeEvents = events.filter(elem => 
          today <= new Date(elem.finish_date) && today >= new Date(elem.start_date)
        )
        const pastEvents = events.filter(elem => 
          today > new Date(elem.finish_date)
        )
        const futureEvents = events.filter(elem => 
          today < new Date(elem.start_date)
        )
        futureEvents.sort((a,b) => {
          const dateA = new Date(a.start_date)
          const dateB = new Date(b.start_date)
          if(dateA == dateB) return 0
          if(dateA < dateB) return -1
            else return 1
        })
        pastEvents.sort((a,b) => {
          const dateA = new Date(a.finish_date)
          const dateB = new Date(b.finish_date)
          if(dateA == dateB) return 0
          if(dateA < dateB) return 1
            else return -1
        })
        return activeEvents.concat(futureEvents, pastEvents)
      }
    },
    created() {
      this.$http.get('http://localhost:3000/api/events').then(response => {
        this.events = this.sortEvents(response.data.events)
          console.log(response)
        }).catch(err => console.log(err))
    }
  }
</script>
<style scoped>
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
</style>