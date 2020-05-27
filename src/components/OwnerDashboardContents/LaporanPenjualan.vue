<template>
  <v-container fill-height fluid>
    <v-row row align="center" justify="center">
      <v-col cols="4" sm="4">
        <v-card color="#455A64" dark>
          <v-card-title class="headline">Laporan Penjualan Produk Terlaris</v-card-title>

          <v-card-subtitle>Pilih Tahun penjualan produk yang ingin dilihat.</v-card-subtitle>

          <v-card-actions>
            <v-btn color="white" icon fab @click="dialogProduk=true">
              <v-icon>mdi-calendar-month-outline</v-icon>
            </v-btn>
            <!-- <v-icon color="indigo">mdi-pencil</v-icon>
            <v-btn text></v-btn>-->
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card color="#455A64" dark>
          <v-card-title class="headline">Laporan Penjualan Layanan Terlaris</v-card-title>

          <v-card-subtitle>Pilih Tahun penjualan jasa layanan yang ingin dilihat</v-card-subtitle>

          <v-card-actions>
            <v-btn color="white" icon fab @click="dialogLayanan=true">
              <v-icon>mdi-calendar-month-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogProduk" hide-overlay max width="600">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row justify="space-around">
              <v-text-field v-model="tahun" :rules="rules" counter="4"></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogProduk=false, reset()">Close</v-btn>
          <v-btn color="blue darken-1" @click="printProduk(), reset()" text>Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogLayanan" hide-overlay max width="600">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row justify="space-around">
              <v-text-field v-model="tahun" :rules="rules" counter="4"></v-text-field>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogLayanan=false, reset()">Close</v-btn>
          <v-btn color="blue darken-1" @click="printLayanan(), reset()" text>Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    dialogProduk: false,
    dialogLayanan: false,
    tahun: "",
    rules: [
      v => v.length <= 4 || "Max 4 characters",
      v => v.length > 0 || "Tidak Boleh Kosong"
    ]
  }),

  methods: {
    printProduk() {
      this.dialogProduk = false;
      var uri = this.$apiUrl + "laporan/produkTerlaris/" + this.tahun;
      this.$http
        .get(uri, { responseType: "blob" })
        .then(response => {
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        })
        .catch(error => {});
    },

    printLayanan() {
      this.dialogLayanan = false;
      var uri = this.$apiUrl + "laporan/layananTerlaris/" + this.tahun;
      this.$http
        .get(uri, { responseType: "blob" })
        .then(response => {
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
        })
        .catch(error => {});
    },

    reset() {
      this.tahun = "";
    }
  }
};
</script>