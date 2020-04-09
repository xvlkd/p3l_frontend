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
		beforeEnter: (to, from, next) => {
			if (sessionStorage.getItem("NIP") == "Owner") {
				next();
			} else {
				sessionStorage.removeItem("NIP");
				sessionStorage.removeItem("Nama")
				next({
					path: "/"
				});
			}
		},
		name: 'OwnerPage',
		path: '/owner',
		component: DashboardOwner,
		children: [{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Pegawai',
				path: '/pegawai',
				component: loadDashboardOWner('Pegawai'),
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Layanan',
				path: '/layanan',
				component: loadDashboardOWner('Layanan')
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Produk',
				path: '/produk',
				component: loadDashboardOWner('Produk')
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Deleted Produk',
				path: '/deleted-produk',
				component: loadDashboardOWner('DeletedProduk')
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Supplier',
				path: '/supplier',
				component: loadDashboardOWner('Supplier')
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Jenis Hewan',
				path: '/jenisHewan',
				component: loadDashboardOWner('JenisHewan')
			},

			{
				beforeEnter: (to, from, next) => {
					if (sessionStorage.getItem("NIP") == "Owner") {
						next();
					} else {
						sessionStorage.removeItem("NIP");
						sessionStorage.removeItem("Nama")
						next({
							path: "/"
						});
					}
				},
				name: 'Ukuran Hewan',
				path: '/ukuranHewan',
				component: loadDashboardOWner('UkuranHewan')
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