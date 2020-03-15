import Vue from 'vue'
import Router from 'vue-router'

const Dashboard = () => import('../components/Dashboard.vue')

function loadDashboard(view) {
    return () => import(`../components/dashboardContents/${view}.vue`)
}

Vue.use(Router)

const routes = [{
    path: '/dashboard',
    component: Dashboard,
    children: [{
            name: 'Pegawai',
            path: '/Pegawai',
            component: loadDashboard('Pegawai')
        },
        {
            name: 'Layanan',
            path: '/Layanan',
            component: loadDashboard('Layanan')
        },
        {
            name: 'Produk',
            path: '/Produk',
            component: loadDashboard('Produk')
        },
        {
            name: 'Supplier',
            path: '/Supplier',
            component: loadDashboard('Supplier')
        },
    ]
}, ]

const router = new Router({
    mode: 'history',
    routes: routes
})

export default router