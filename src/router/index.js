import Vue from 'vue';
import Router from 'vue-router';

const LoginPage = () => import('../components/LoginPage.vue');
const DashboardOwner = () => import('../components/OwnerDashboard.vue');
const DashboardCS = () => import('../components/CSDashboard.vue');

function loadDashboard(view) {
	return () => import(`../components/OwnerDashboardContents/${view}.vue`);
}

Vue.use(Router);

const routes = [
	{
		name: 'landingPage',
		path: '/',
		component: LoginPage
	},

	{
		name: 'OwnerPage',
		path: '/owner',
		component: DashboardOwner,
		children: [
			{
				name: 'Pegawai',
				path: '/pegawai',
				component: loadDashboard('Pegawai'),
				meta: {
					auth: true
				}
			},
			// {
			// 	name: 'Customer',
			// 	path: '/customer',
			// 	component: loadDashboard('Customer')
			// },
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
				name: 'Deleted Produk',
				path: '/deleted-produk',
				component: loadDashboard('DeletedProduk')
			},
			{
				name: 'Supplier',
				path: '/supplier',
				component: loadDashboard('Supplier')
			},
			// {
			// 	name: 'Hewan',
			// 	path: '/hewan',
			// 	component: loadDashboard('Hewan')
			// },
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
			{
				name: 'Deleted Ukuran Hewan',
				path: '/deleted-ukuranHewan',
				component: loadDashboard('DeletedUkuranHewan')
			}
		]
	},

	{
		name: 'CSPage',
		path: '/customerService',
		component: DashboardCS
	}
];

const router = new Router({
	mode: 'history',
	routes: routes
});

export default router;
