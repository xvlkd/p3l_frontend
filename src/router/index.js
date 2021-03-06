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

function loadDashboardKasir(view) {
	return () => import(`../components/KasirDashboardContents/${view}.vue`);
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
				name: 'ProdukMinimal',
				path: '/produkMin',
				component: loadDashboardOWner('ProdukMin')
			},

			{
				name: 'Pengadaan',
				path: '/pengadaan',
				component: loadDashboardOWner('Pengadaan')
			},

			{
				name: 'Laporan Pengadaan',
				path: '/laporanPengadaan',
				component: loadDashboardOWner('LaporanPengadaan')
			},

			{
				name: 'Laporan Penjualan',
				path: '/laporanPenjualanTerlaris',
				component: loadDashboardOWner('LaporanPenjualan')
			},

			{
				name: 'Laporan Pendapatan',
				path: '/laporanPendapatan',
				component: loadDashboardOWner('LaporanPendapatan')
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
			{
				name: 'Transaksi Produk',
				path: '/transaksiProduk',
				component: loadDashboardCS('TransaksiProduk')
			},
			{
				name: 'Transaksi Layanan',
				path: '/transaksiLayanan',
				component: loadDashboardCS('TransaksiLayanan')
			},
		]
	},

	{
		name: 'KasirPage',
		path: '/kasir',
		component: DashboardKasir,
		children: [{
				name: 'Pembayaran Produk',
				path: '/bayarProduk',
				component: loadDashboardKasir('BayarProduk')
			},
			{
				name: 'Pembayaran Layanan',
				path: '/bayarLayanan',
				component: loadDashboardKasir('BayarLayanan')
			},
		]
	}
];

const router = new Router({
	mode: 'history',
	routes: routes
});

export default router;