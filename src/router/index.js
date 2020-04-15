import Vue from 'vue';
import Router from 'vue-router';

const LoginPage = () => import('../components/LoginPage.vue');

const DashboardOwner = () => import('../components/OwnerDashboard.vue');
const DashboardCS = () => import('../components/CSDashboard.vue');
const DashboardKasir = () => import('../components/KasirDashboard.vue');

function loadDashboardOWner(view) {
	return () => import(`../components/OwnerDashboardContents/${view}.vue`);
}

function loadDashboardCS(view) {
	return () => import(`../components/CSDashboardContents/${view}.vue`);
}

Vue.use(Router);

const routes = [{
		name: 'Login Page',
		path: '/',
		component: LoginPage
	},

	{
		name: 'OwnerPage',
		path: '/owner',
		component: DashboardOwner,
		children: [{
				name: 'OwnerProfile',
				path: '/ownerProfile',
				component: loadDashboardOWner('Profile'),
			},

			{
				name: 'Pegawai',
				path: '/pegawai',
				component: loadDashboardOWner('Pegawai'),
			},

			{
				name: 'Layanan',
				path: '/layanan',
				component: loadDashboardOWner('Layanan')
			},

			{
				name: 'Produk',
				path: '/produk',
				component: loadDashboardOWner('Produk')
			},

			{
				name: 'Deleted Produk',
				path: '/deleted-produk',
				component: loadDashboardOWner('DeletedProduk')
			},

			{
				name: 'Supplier',
				path: '/supplier',
				component: loadDashboardOWner('Supplier')
			},

			{
				name: 'Jenis Hewan',
				path: '/jenisHewan',
				component: loadDashboardOWner('JenisHewan')
			},

			{
				name: 'Ukuran Hewan',
				path: '/ukuranHewan',
				component: loadDashboardOWner('UkuranHewan')
			},

			{
				name: 'Hewan',
				path: '/hewan',
				component: loadDashboardOWner('Hewan')
			},

			{
				name: 'Customer',
				path: '/customer',
				component: loadDashboardOWner('Customer')
			},

			{
				name: 'Pengadaan',
				path: '/pengadaan',
				component: loadDashboardOWner('Pengadaan')
			},
		]
	},

	{
		name: 'CSPage',
		path: '/customerService',
		component: DashboardCS,
		children: [{
				name: 'Customer',
				path: '/customer',
				component: loadDashboardCS('Customer')
			},
			{
				name: 'Hewan',
				path: '/hewan',
				component: loadDashboardCS('Hewan')
			},
		]
	},

	{
		name: 'KasirPage',
		path: '/kasir',
		component: DashboardKasir,

	}
];

const router = new Router({
	mode: 'history',
	routes: routes
});

export default router;