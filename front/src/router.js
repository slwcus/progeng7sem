import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import HomeView from './components/Home';
import Profile from './components/Profile';
import Users from './components/Users';
import Events from './components/events/Events'
import Event from './components/events/Event'
import NewEvent from './components/events/NewEvent'
import Document from './components/documents/Document'
import Documents from './components/documents/Documents'
import AdminDocuments from './components/documents/AdminDocuments'
import NewDocument from './components/documents/NewDocument'
import Confirmation from './components/Confirmation'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/confirmation',
      name: 'confirmation',
      component: Confirmation,
      props: true
    },
    { 
      path: '/login', 
      component: LoginView 
    },
     { 
      path: '/profile', 
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    { 
      path: '/registration', 
      component: RegisterView 
    },
    { 
      path: '/', 
      component: HomeView, 
      meta: {
        requiresAuth: true
      } 
    },
    { 
      path: '/users', 
      component: Users,
      props: (route) => ({ event_id: route.query.event_id }),
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/events',
      component: Events,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/event/:id',
      component: Event,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/new-event',
      component: NewEvent,
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/new-document',
      component: NewDocument,
      meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/document/:id',
      component: Document,
      meta: {
        requiresAuth: true
      },
      props: true
    },
    {
      path: '/documents',
      component: AdminDocuments,
       meta: {
        requiresAuth: true
      } 
    },
    {
      path: '/user-desk',
      component: Documents
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router