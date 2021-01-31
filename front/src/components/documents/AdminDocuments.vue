<template>
  <v-container>
    <v-row>
      <v-col >
       <v-data-table :headers="headers" :items="documents" @click:row="rowClick">
       </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {

    data: () => ({
      documents: [],

      roles: [],
      headers: [
      {
        text: 'Document',
        value: 'title'
      },
      {
        text: 'Day', 
        value: 'day'
      },
      {
        text: 'Event',
        value: 'event_id.title'
      },
      {
        text: 'For',
        value: 'rolename'
      }
      ]
    }),
    methods: {
       rowClick(row, data){
        this.$router.push(`/document/${data.item._id}`)
      },
    },
    created() {
      
      this.$http.get(`${this.$constants.API_URL}/utility/roles`).then(response => {
        this.roles = response.data.roles
        this.$http.get('http://localhost:3000/api/documents').then(response =>
          { let documents = response.data.documents
            documents.forEach((elem) => {
              this.$set(elem, 'signed', !!elem.signed_by)
              this.$set(elem, 'rolename', this.roles.find(role => role.id == elem.role).name)
            })
            this.documents = documents
          }
        ).catch(err => console.log(err))
        }).catch(err => console.log(err))

    }
  }
</script>
<style scoped>
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
</style>