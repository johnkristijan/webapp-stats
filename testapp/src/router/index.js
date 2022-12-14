import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import webappStatTrack from 'webapp-stats'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: function () {
            return import(
                /* webpackChunkName: "other" */ '../views/AboutView.vue'
            )
        },
    },
    {
        path: '/admin',
        name: 'admin',
        component: function () {
            return import(
                /* webpackChunkName: "other" */ '../views/AdminView.vue'
            )
        },
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from) => {
    const appId = "22c4c3f7-609d-4bd2-a239-8bebfc8b59e4"
    webappStatTrack(to, from, appId)
})

export default router
