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
            path: '/Pegawai',
            component: loadDashboard('Pegawai')
        },
        {
            name: 'Customer',
            path: '/Customer',
            component: loadDashboard('Customer')
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