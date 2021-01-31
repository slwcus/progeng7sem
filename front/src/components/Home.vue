<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card >
          <v-card-title class="primary white--text">Users</v-card-title>
          <v-card-text>
            <v-list >
              <template v-for="(action,i) in usersActions">
              <v-list-item :to="action.to" 
               v-if="action.availableFor.includes($store.state.user.role)"  :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{action.title}}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="primary white--text">Events</v-card-title>
          <v-card-text>
            <v-list>
              <template v-for="(action,i) in eventsActions">
              <v-list-item :to="action.to" 

               v-if="action.availableFor.includes($store.state.user.role)"  :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{action.title}}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card>
          <v-card-title class="primary white--text">Documents</v-card-title>
          <v-card-text>
            <v-list>
              <template v-for="(action,i) in documentsActions">
              <v-list-item :to="action.to" 
              v-if="action.availableFor.includes($store.state.user.role)"  :key="i">
                  <v-list-item-content>
                    <v-list-item-title>{{action.title}}</v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
              </template>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      usersActions: [
        {
          title: 'Browse',
          to: '/users',
          availableFor: [0,1,2,3]
        },
         {
          title: 'Create',
          to: '/registration',
          availableFor: [0,1,2,3]
        },
      ],
      eventsActions: [
        {
          title: 'Browse',
          to: '/events',
          availableFor: [0,1,2,3]
        },
        {
          title: 'Create',
          to: '/new-event',
          availableFor: [0,1,2,3]
        },
      ],
      documentsActions: [
        {
          title: 'Browse',
          to: '/documents',
          availableFor: [0,1,2,3]
        },
        {
          title: 'Create',
          to: '/new-document',
          availableFor: [0,1,2,3]
        },
      ]
    }),
    methods: {
      getUsers(){
        this.$http.get('http://localhost:3000/api/users').then(response =>
          console.log(response.data)
        ).catch(err => console.log(err))
      }
    },
    created(){
     if(this.$store.state.user.role > 0){
      this.$router.push('/user-desk')
     }
    }
  }
</script>
<style scoped>
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
</style>