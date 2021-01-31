<template>
  <v-app>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{snackbar.text}}
    </v-snackbar>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-btn v-if="$route.path != '/'" to="/" icon><v-icon>mdi-home</v-icon></v-btn>
    <v-spacer></v-spacer>
    <v-menu  offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-avatar color="indigo" v-bind="attrs"
          v-on="on">
          <v-icon dark>
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </template>
      <v-list>
        <v-list-item to="/profile">
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title >Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fill-height>
        <router-view></router-view>
    </v-container>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'App',

  components: {
    
  },

  data: () => ({
    snackbar: {
      show: false,
      color: "error",
      text: "SomeText"
    }
  }),
  methods: {
    showSnackbar(text, color){
      this.snackbar.show = true
      this.snackbar.text = text
      this.snackbar.color = color
    },
    logout(){
      this.$store.dispatch('logout').then(() => this.$router.push('/login')).catch(err => console.log(err))
    }
  },
  created(){
    this.$store.dispatch('refresh').then(() => this.$router.push('/')).catch(err => console.log(err))
  }
};
</script>
