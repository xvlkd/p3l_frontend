<template>
  <v-container fill-height fluid>
    <v-row row align="center" justify="center">
      <v-col cols="4" sm="4">
        <v-card color="#455A64" dark>
          <v-card-title class="headline">Laporan Pendapatan Bulanan</v-card-title>

          <v-card-subtitle>Pilih Bulan dan Tahun pendapatan yang ingin dilihat.</v-card-subtitle>

          <v-card-actions>
            <v-btn color="white" icon fab @click="dialogBulan=true">
              <v-icon>mdi-calendar-month-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card color="#455A64" dark>
          <v-card-title class="headline">Laporan Pendapatan Tahunan</v-card-title>

          <v-card-subtitle>Pilih Tahun pendapatan yang ingin dilihat.</v-card-subtitle>

          <v-card-actions>
            <v-btn color="white" icon fab @click="dialogTahun=true">
              <v-icon>mdi-calendar-month-outline</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogBulan" hide-overlay max width="600">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row justify="space-around">
              <v-date-picker
                v-model="date"
                :landscape="dialogBulan"
                :show-current="false"
                type="month"
                color="green lighten-1"
              ></v-date-picker>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogBulan=false">Close</v-btn>
          <v-btn color="blue darken-1" @click="getDate(), printBulan()" text>Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogTahun" hide-overlay max width="600">
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
          <v-btn color="red darken-1" text @click="dialogTahun=false, reset()">Close</v-btn>
          <v-btn color="blue darken-1" @click="printTahun(), reset()" text>Choose</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from "moment";

export default {
  data: () => ({
    dialogBulan: false,
    dialogTahun: false,
    date: new Date().toISOString().substr(0, 7),
    tanggal: "",
    tahun: "",
    bulan: "",
    namaBulan: "",
    rules: [
      v => v.length <= 4 || "Max 4 characters",
      v => v.length > 0 || "Tidak Boleh Kosong"
    ]
  }),
  methods: {
    getDate() {
      this.bulan = this.date.substr(5, 7);
      this.tahun = this.date.substr(0, 4);
      if (this.bulan == "01") {
        this.namaBulan = "Januari";
      } else if (this.bulan == "02") {
        this.namaBulan = "Februari";
      } else if (this.bulan == "03") {
        this.namaBulan = "Maret";
      } else if (this.bulan == "04") {
        this.namaBulan = "April";
      } else if (this.bulan == "05") {
        this.namaBulan = "Mei";
      } else if (this.bulan == "06") {
        this.namaBulan = "Juni";
      } else if (this.bulan == "07") {
        this.namaBulan = "Juli";
      } else if (this.bulan == "08") {
        this.namaBulan = "Agustus";
      } else if (this.bulan == "09") {
        this.namaBulan = "September";
      } else if (this.bulan == "10") {
        this.namaBulan = "Oktober";
      } else if (this.bulan == "11") {
        this.namaBulan = "November";
      } else {
        this.namaBulan = "Desember";
      }
    },

    printBulan() {
      this.dialogBulan = false;
      var uri =
        this.$apiUrl +
        "laporan/pendapatanBulanan/" +
        this.tahun +
        "/Bulan/" +
        this.namaBulan;
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

    printTahun() {
      this.dialogTahun = false;
      var uri = this.$apiUrl + "laporan/pendapatanTahunan/" + this.tahun;
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
  },
  computed: {
    formattedDate() {
      return (this.tanggal = this.date
        ? moment(this.date).format("MMMM YYYY")
        : "");
    }
  }
};
</script>