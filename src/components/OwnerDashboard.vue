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
        <v-list-item v-for="item in items" :key="item.title" link @click="$router.push(item.to)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar dark app fixed clipped-left height="70px" color="grey darken-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer />
      <v-toolbar-title>Kouvee Petshop - {{nama}}</v-toolbar-title>
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
      },
      {
        title: "Pengadaan",
        icon: "mdi-package",
        to: "/pengadaan"
      }
    ],
    nip: sessionStorage.getItem("NIP"),
    nama: sessionStorage.getItem("Nama"),
    jabatan: sessionStorage.getItem("Jabatan")
  }),

  methods: {
    logout() {
      sessionStorage.removeItem("NIP");
      sessionStorage.removeItem("Nama");
      sessionStorage.removeItem("Jabatan");
      this.$router.push({ name: "Login Page" });
    }
  }
};
</script>