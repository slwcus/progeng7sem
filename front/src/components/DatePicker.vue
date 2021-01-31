<template>
<v-menu
        ref="menu"
        v-model="showMenu"
        :close-on-content-click="false"
        
        transition="scale-transition"
        offset-y
        min-width="290px"
      >
        <v-date-picker
          v-model="inputVal"
          no-title
          scrollable
          :min="start"
          :max="end"
        >
          
        </v-date-picker>
      </v-menu>
</template>
<script>
  export default {
    props: {
      value: String,
      show: {
        type: Boolean,
        default: false
      },
      start: {
        type: String,
        default: ''
      },
      end: {
        type: String,
        default: ''
      },
      acceptAction: {
        type: Function,
        default: () => { this.show = false}
      }

    },
    data: () => ({
      showMenu: false
    }),
    created(){
      this.showMenu = this.show
    },
    computed: {
      inputVal: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
          this.$emit('close-picker')
        }
      }
    },
    watch: {
      show: function(val){
        this.showMenu = val
      },
      showMenu: function(val){
        if(!val){
          console.log(123123)
          this.$emit('close-picker')
        }
      }
    }
  }
</script>