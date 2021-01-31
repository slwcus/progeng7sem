import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import store from './store.js'
import router from './router.js'
import Axios from 'axios'
import VueMask from 'v-mask'
import DatePicker from './components/DatePicker'
import * as constants from '../constants'

Vue.prototype.$apiUrl = 'http://localhost:3000'
Vue.prototype.$http = Axios
Vue.prototype.$user = null
Vue.prototype.$constants = constants
const token = localStorage.getItem('token')

Vue.use(Vuelidate)
Vue.use(VueMask)

Vue.component('datepicker',DatePicker)

if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

Vue.prototype.$getErrorMessage = function (errorsObj, fieldName){
			
		const errors = []
        if (!errorsObj.$dirty) return errors


       if(typeof errorsObj.maxLength !== 'undefined'){
        	!errorsObj.maxLength && errors.push(`${fieldName} must be at most 10 characters long`)
    	}
        if(typeof errorsObj.required !== 'undefined') { 
        	!errorsObj.required && errors.push(`${fieldName} is required.`)
    	}
    	if(typeof errorsObj.sameAsPassword !== 'undefined'){
    		!errorsObj.sameAsPassword && errors.push('Passwords must be identical.')
    	}
    	if(typeof errorsObj.regionRequired !== 'undefined'){
    		
    		!errorsObj.regionRequired && errors.push(`${fieldName} is required.`)
    	}
        return errors
	}

Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
