<template>
  <v-container>
    <v-row>
      <v-col >
       <v-data-table :headers="headers" :items="users">
         <template v-slot:item="{item}">
          <tr>
           <td>{{item.first_name}} {{item.last_name}}</td>
           <td><v-select :items="events" item-text="title" item-value="_id" v-model="item.event"></v-select></td>
           <td><v-select :items="roles" item-text="name" item-value="id" v-model="item.role"></v-select></td>
           <td>
            <v-btn v-if="item.assigned" color="error"  @click="unassignUser(item)">Remove</v-btn>
            <v-btn v-else color="success" @click="assignUser(item)">Assign</v-btn>
          </td>
         </tr>
         </template>
       </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    props: ['event_id'],
    data: () => ({
      users: [],
      events: [],
      roles: [],
      headers: [{
        text: 'User',
        value: 'user'
      },
      {
        text: 'Event',
        value: 'events'
      },
      {
        text: 'Role',
        value: 'roles'
      },
      {
        text: 'Assign',
        value: 'assign'
      }],
    }),
    methods: {
      assignUser(user){
        if(!user.event || !user.role){
          this.$root.$children[0].showSnackbar('Select event and role', 'error')
          return
        }
        const data = {
          event_id: user.event,
          role: user.role
        }
        this.$http.put(`${this.$constants.API_URL}/users/${user._id}/assign`,data).then(response => {
          this.$set(user, 'assigned', true)
        }).catch(err => console.log(err))
      },
      unassignUser(user){
        this.$http.put(`${this.$constants.API_URL}/users/${user._id}/unassign`,{email: user.email}).then(response => {
            this.$set(user, 'assigned', false)
        }).catch(err => console.log(err))
      }
    },
    created() {
      this.$http.get(`${this.$constants.API_URL}/users`).then(response => {
          this.users = response.data.users
          this.users.forEach(elem => {
            this.$set(elem, 'assigned', !!elem.event)
          })
          console.log(this.event_id)
          if(this.event_id){
            this.users = this.users.filter(elem => !elem.assigned)
            this.users.forEach(elem => {
              this.$set(elem, 'event', this.event_id)
            })
          }
        }
        ).catch(err => console.log(err))
      this.$http.get(`${this.$constants.API_URL}/events`,{params: {actual: true}}).then(response => {
        this.events = response.data.events
        }).catch(err => console.log(err))
      this.$http.get(`${this.$constants.API_URL}/utility/roles`).then(response => {
        this.roles = response.data.roles
        }).catch(err => console.log(err))

    }
  }
</script>
<style scoped>
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
</style>