<template>
  <v-container>
    <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="pinEnter"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          >Enter PIN</v-toolbar>
          <v-card-text>
            <v-text-field label="PIN" v-model="pin"></v-text-field>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn
              text
              @click="signDoc"
            >OK</v-btn>
            <v-btn
              text
              @click="cancel"
            >Cancel</v-btn>
          </v-card-actions>
        </v-card>
     
      </v-dialog>
    <v-row>
      <v-col >
       <v-data-table :headers="headers" :items="documents" @click:row="rowClick" no-data-text="No events for you">
         <template v-slot:item.signed="{ item }">
            <v-btn v-if="!item.signed" @click.stop="signAction(item)">Sign</v-btn>{{item.signed ? 'Signed' : ''}}
          </template>
       </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {

    data: () => ({
      pinEnter: false,
      pin: '',
      doc: null,
      documents: [],
      headers: [{
        text: 'Day', 
        value: 'day'
      },
      {
        text: 'Document',
        value: 'title'
      },
      {
        text: 'Event',
        value: 'event_id.title'
      },{
        text: 'Signed',
        value: 'signed'
      }]
    }),
    methods: {
      rowClick(row, data){
        this.$router.push(`/document/${data.item._id}`)
      },
      signDoc(){
        this.$http.put(`${this.$constants.API_URL}/documents/${this.doc._id}/sign`, {pin : this.pin})
        .then(res => {
          this.$set(this.doc, 'signed', true)
          this.cancel()
        }).catch(err => {
          this.$root.$children[0].showSnackbar('Wrong PIN', 'error')
        })
      },
      cancel(){
        this.doc = null
        this.pin = ''
        this.pinEnter = false
      },
      signAction(doc){
        this.pinEnter = true
        this.doc = doc
      },
    },
    created() {
      this.$http.get('http://localhost:3000/api/documents?foruser=true').then(response =>
          { let documents = response.data.documents
            documents.forEach((elem) => {
              this.$set(elem, 'signed', !!elem.signed_by)
            })
            this.documents = documents
          console.log(response.data)}
        ).catch(err => console.log(err))
    }
  }
</script>
<style scoped>
  .theme--light.v-list-item--active::before {
    opacity: 0;
  }
</style>