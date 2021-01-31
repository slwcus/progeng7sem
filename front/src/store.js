import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as constants from '../constants.js'
import jwt_decode from "jwt-decode";
import router from './router';

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
  		status: '',
  		token: localStorage.getItem('token') || '',
  		user : null
	},
	mutations: {
		auth_request(state){
	    	state.status = 'loading'
	  	},
	  	auth_success(state, data){
		    state.status = 'success'
		    state.token = data.token
		    state.user = data.user
	  	},
	  	auth_error(state){
	    	state.status = 'error'
	  	},
	  	logout(state){
	    	state.status = ''
	    	state.token = ''
	  	},
	},
	actions: {
		loadUser({commit}){

		},
		refresh({commit}){
	        return new Promise((resolve, reject) => {
	            commit('auth_request')
	            var urlParams = new URLSearchParams(window.location.search);
	            let params = null
	            if(urlParams.getAll('refreshToken')){
	            	params = {refreshToken: urlParams.getAll('refreshToken')[0]}
	            	
	            }

	            axios({url: `${constants.API_URL}/auth/refresh`, method: 'GET', params: params })
	            .then(resp => {
	                const token = resp.data.token
	                

	               var decoded = jwt_decode(token);
	            
	               
	               // localStorage.setItem('token', token)
	                // Add the following line:
	                setTimeout(() => {
	                	console.log(this)
	                	this.dispatch('refresh').catch(err => this.dispatch('logout'))
	                },decoded.exp * 1000 - Date.now() - 5000)
	                axios.defaults.headers.common['Authorization'] = token
	                commit('auth_success', {token: token, user: decoded.data})
	                resolve(resp)
	            })
	            .catch(err => {
	                commit('auth_error')
	              	reject(err)
	            })
	        })
	    },
	  	login({commit}, loginData){
	        return new Promise((resolve, reject) => {
	            commit('auth_request')
	            axios({url: `${constants.API_URL}/auth/login`, data: loginData, method: 'POST' })
	            .then(resp => {
	                const token = resp.data.token
	                const user = resp.data.user

	               
	               
	               // localStorage.setItem('token', token)
	                // Add the following line:
	                var decoded = jwt_decode(token);
	          
	                setTimeout(() => {
	                	
	                	this.dispatch('refresh').catch(err => this.dispatch('logout'))
	                },decoded.exp * 1000 - Date.now())
	                var date = new Date(decoded.exp * 1000)
	              
	              
	                axios.defaults.headers.common['Authorization'] = token
	                commit('auth_success', {token: token, user: decoded.data})
	                resolve(resp)
	            })
	            .catch(err => {
	                commit('auth_error')
	                localStorage.removeItem('token')
	                reject(err)
	            })
	        })
	    },
	    register({commit}, user){
	    	return new Promise((resolve, reject) => {
	            commit('auth_request')
	            axios({url: `${constants.API_URL}/users/register`, data: user, method: 'POST' })
	            .then(resp => {
	                //const token = resp.data.token
	                //const user = resp.data.user
	                //localStorage.setItem('token', token)
	                // Add the following line:
	                //axios.defaults.headers.common['Authorization'] = token
	                //commit('auth_success', token, user)
	                //console.log(document.cookie)
	                resolve(resp) 
	            })
	            .catch(err => {
	                commit('auth_error', err)
	                localStorage.removeItem('token')
	                reject(err)
	            })
	        })
	    },
	  	logout({commit}){
		    return new Promise((resolve, reject) => {
		      	commit('logout')
		      	localStorage.removeItem('token')
		      	delete axios.defaults.headers.common['Authorization']
		      	axios({url: `${constants.API_URL}/auth/logout`, method: 'GET' })
	            .then(resp => {
	               
	            })
	            .catch(err => {
	                console.log(err)
	            })

		      	resolve()
		    })
	  	}
	},
	getters : {
	  isLoggedIn: state => !!state.token,
	  authStatus: state => state.status,
	}
})