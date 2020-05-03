<template>
  <div>
    <v-navigation-drawer v-model="drawer" class="greydarken-3" dark app clipped fixed temporary>
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img :src="$apiUrl + `pegawai/${nip}/gambar`"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>NIP: {{nip}}</v-list-item-title>
          <v-list-item-subtitle>{{jabatan}}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list>
        <v-list-group prepend-icon="mdi-file-multiple" value="true" no-action>
          <template v-slot:activator>
            <v-list-item-title>Data</v-list-item-title>
          </template>
          <v-list-item v-for="item in items" :key="item.title" link @click="$router.push(item.to)">
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider />
        <v-list-group prepend-icon="mdi-bank-transfer" no-action>
          <template v-slot:activator>
            <v-list-item-title>Transaksi</v-list-item-title>
          </template>
          <v-list-item
            v-for="item in transaksi"
            :key="item.title"
            link
            @click="$router.push(item.to)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider />
        <v-list-group prepend-icon="mdi-alpha-d-circle" no-action>
          <template v-slot:activator>
            <v-list-item-title>Detail</v-list-item-title>
          </template>
          <v-list-item
            v-for="item in details"
            :key="item.title"
            link
            @click="$router.push(item.to)"
          >
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark app fixed clipped-left height="70px" color="grey darken-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title>Kouvee Petshop - {{this.nama}}</v-toolbar-title>
      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <div v-on="on">
            <v-btn icon>
              <v-icon color="grey lighten-1" @click="logout()">mdi-logout</v-icon>
            </v-btn>
          </div>
        </template>
        <span>Logout</span>
      </v-tooltip>
    </v-app-bar>

    <VContent>
      <router-view />
    </VContent>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      {
        title: "Pegawai",
        icon: "mdi-account-group",
        to: "/Pegawai"
      },
      {
        title: "Layanan",
        icon: "mdi-face-agent",
        to: "/Layanan"
      },
      {
        title: "Produk",
        icon: "mdi-package-variant-closed",
        to: "/Produk"
      },
      {
        title: "Supplier",
        icon: "mdi-truck-fast",
        to: "/Supplier"
      },
      {
        title: "Jenis Hewan",
        icon: "mdi-dog",
        to: "/jenisHewan"
      },
      {
        title: "Ukuran Hewan",
        icon: "mdi-size-xxl",
        to: "/ukuranHewan"
      }
    ],
    transaksi: [
      {
        title: "Pengadaan",
        icon: "mdi-package",
        to: "/produkMin"
      }
    ],
    details: [],
    nip: "",
    nama: "",
    jabatan: ""
  }),

  methods: {
    logout() {
      this.$session.destroy();
      this.$router.push({ name: "Login Page" });
    }
  },

  mounted() {
    if (!this.$session.exists()) this.$router.push({ name: "Login Page" });
    else {
      this.nip = this.$session.get("NIP");
      this.nama = this.$session.get("Nama");
      this.jabatan = this.$session.get("Jabatan");
    }
  }
};
</script>