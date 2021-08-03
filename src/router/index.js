import Vue from 'vue'
import VueRouter from 'vue-router'
import Orderbook from '../views/Orderbook.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Orderbook',
    component: Orderbook,
    meta: {
      title: "OrderBook"      
    }
  },
  {
    path: '/chart',
    name: 'Chart',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Chart.vue'),
    meta: {
      title: "Chart"     
    }
  },
  {
    path: "/metamask",
    name: "Metamask",
    component: () => import("../views/Metamask.vue"),
    meta: {
      title: "Metamask",
    }
  },
  
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || "Vuetify Blog Template";
  if (typeof(to.meta) === "function") document.title = to.meta(to).title;
  next();
})

export default router
