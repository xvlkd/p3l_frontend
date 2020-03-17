import Vue from 'vue'
import Router from 'vue-router'

const Dashboard = () => import('../components/Dashboard.vue')

function loadDashboard(view) {
    return () => import(`../components/dashboardContents/${view}.vue`)
}

Vue.use(Router)

const routes = [{
    path: '/',
    component: Dashboard,
    children: [{
            name: 'Pegawai',
            path: '/pegawai',
            component: loadDashboard('Pegawai')
        },
        {
            name: 'Layanan',
            path: '/layanan',
            component: loadDashboard('Layanan')
        },
        {
            name: 'Produk',
            path: '/produk',
            component: loadDashboard('Produk')
        },
        {
            name: 'Supplier',
            path: '/supplier',
            component: loadDashboard('Supplier')
        },
        {
            name: 'Jenis Hewan',
            path: '/jenisHewan',
            component: loadDashboard('JenisHewan')
        },
        {
            name: 'Ukuran Hewan',
            path: '/ukuranHewan',
            component: loadDashboard('UkuranHewan')
        },
    ]
}, ]

const router = new Router({
    mode: 'history',
    routes: routes
})

export default router