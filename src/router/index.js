import Vue from 'vue';
import Router from 'vue-router';

const DashboardOwner = () => import('../components/OwnerDashboard.vue');
const LoginPage = () => import('../components/LoginPage.vue');

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
		path: '/owner',
		component: DashboardOwner,
		children: [
			{
				name: 'Pegawai',
				path: '/pegawai',
				component: loadDashboard('Pegawai')
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
			}
		]
	}
];

const router = new Router({
	mode: 'history',
	routes: routes
});

export default router;
