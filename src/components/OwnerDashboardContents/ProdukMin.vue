<template>
  <v-data-table :headers="headers" :items="produks" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Data Produk Minimal</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <v-divider class="mx-4" inset vertical></v-divider>

        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="green accent-3"
          @click="pengadaan()"
          class="mr-4"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tampil Pengadaan
        </v-btn>
      </v-toolbar>
    </template>

    <template v-slot:item.gambar="{ item }">
      <v-img :src="$apiUrl + 'produk/' + item.idProduk + '/gambar'" width="80" height="80"></v-img>
    </template>
  </v-data-table>
</template>
    

<script>
export default {
  data: () => ({
    dialog: false,
    items: [],
    keyword: "",
    headers: [
      {
        text: "ID Produk",
        value: "idProduk"
      },
      {
        text: "Nama Produk",
        value: "namaProduk"
      },
      {
        text: "Gambar Produk",
        value: "gambar"
      },
      {
        text: "Harga",
        value: "harga"
      },
      {
        text: "Stok Tersedia",
        value: "stok"
      },
      {
        text: "Jumlah Minimal",
        value: "jumlahMinimal"
      },
      {
        text: "Created By",
        value: "idPegawaiLog"
      }
    ],
    produks: [],
    load: false,
    idPegawaiLog: ""
  }),
  methods: {
    getData() {
      if (status == 0) {
        var uri = this.$apiUrl + "produk/minimal";
        this.$http.get(uri, this.produk).then(response => {
          this.produks = response.data.produk;
        });
      }
    },

    pengadaan() {
      this.$router.push({ name: "Pengadaan" });
    }
  },

  mounted() {
    this.getData();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>

          