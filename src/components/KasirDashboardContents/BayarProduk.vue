<template>
  <v-data-table :headers="headers" :items="transaksis" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Transaksi Produk</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
      </v-toolbar>

      <v-dialog v-model="dialog" persistent max width="1200">
        <v-card>
          <v-card-text>
            <v-container>
              <v-col cols="4">
                Data Transaksi Produk
                <v-text-field
                  class="mt-4"
                  v-if="typeInput === 'edit'"
                  v-model="form.noTransaksi"
                  label="Nomor Transaksi"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>

              <v-row row>
                <v-col cols="4">
                  <div v-if="typeInput === 'edit'">
                    Status Pembayaran*
                    <v-radio-group v-model="form.statusPembayaran" row>
                      <v-radio label="Sudah Bayar" value="Sudah Bayar"></v-radio>
                      <v-radio label="Belum Bayar" value="Belum Bayar"></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>

                <v-col cols="4" v-if="typeInput==='edit'">
                  <v-text-field
                    label="Total Harga"
                    v-model.number="form.totalBiaya"
                    background-color="blue-grey darken-1"
                    prefix="Rp"
                    readonly
                    filled
                    rounded
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- <v-col cols="4"> -->
              <v-row row>
                <v-col cols="4">
                  <div>
                    Membership*
                    <v-radio-group v-model="form.membership" row>
                      <v-radio label="Member" value="Member" @change="statusMember = 1"></v-radio>
                      <v-radio label="Non-Member" value="Non-Member" @change="statusMember = 0"></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>

                <v-col cols="4">
                  <v-select
                    v-if="statusMember === 1"
                    :items="customers"
                    item-text="namaCustomer"
                    item-value="idCustomer"
                    label="Nama Customer*"
                    dense
                    outlined
                    rounded
                    v-model="form.idCustomer"
                    required
                  ></v-select>
                </v-col>
              </v-row>
              <!-- </v-col> -->
            </v-container>

            <v-divider />

            <v-container class="mt-4" v-if="typeInput==='edit'">
              Data Produk
              <div
                class="form-row"
                v-for="(detailTransaksi, index) in detailTransaksis"
                :key="index"
              >
                <v-row>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="detailTransaksi.idProduk"
                      :items="produks"
                      item-text="namaProduk"
                      item-value="idProduk"
                      label="Nama Produk*"
                      @change="hitungSubTotal(index),hitungTotal()"
                      required
                      outlined
                      rounded
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="detailTransaksi.jumlah"
                      required
                      type="number"
                      label="Jumlah*"
                      @change="hitungSubTotal(index),hitungTotal()"
                      clearable
                      outlined
                      rounded
                    ></v-text-field>
                  </v-col>

                  <v-col cols="3">
                    <v-text-field
                      v-model="detailTransaksi.harga"
                      label="Harga"
                      readonly
                      outlined
                      rounded
                      prefix="Rp"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="detailTransaksi.subtotal"
                      label="Subtotal"
                      number
                      readonly
                      outlined
                      rounded
                      prefix="Rp"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="1">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          <v-btn
                            color="red lighten-2"
                            icon
                            @click="hitungTotal(), restoreStok(), deleteDetailProduk(index), deleteRow(index)"
                            class="pt-3"
                          >
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </div>
                      </template>
                      <span>Hapus Produk</span>
                    </v-tooltip>
                  </v-col>
                </v-row>
              </div>

              <v-col cols="2">
                <v-text-field
                  v-if="statusMember === 1"
                  v-model="form.diskon"
                  label="Diskon"
                  number
                  outlined
                  rounded
                  prefix="Rp"
                  @change="hitungTotal()"
                ></v-text-field>
              </v-col>

              <v-row>
                <v-col cols="1" align-end justify-end>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-btn color="green" icon fab @click="addRow()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span>Tambah Produk</span>
                  </v-tooltip>
                </v-col>
              </v-row>
            </v-container>

            <v-divider />
            <div class="mt-4">
              <small>*indicates required field</small>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              @click="dialog=false, resetForm(), resetDynamicForm()"
            >Close</v-btn>
            <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
        {{ text }}
        <v-btn dark text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.noTransaksi)">mdi-delete</v-icon>
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
        text: "No. Transaksi",
        value: "noTransaksi"
      },
      {
        text: "Tanggal Transaksi",
        value: "tglTransaksi"
      },
      {
        text: "Total Biaya",
        value: "totalBiaya"
      },
      {
        text: "Status Pembayaran",
        value: "statusPembayaran"
      },
      {
        text: "Nama Customer",
        value: "namaCustomer"
      },
      {
        text: "Dilayani oleh",
        value: "idCustomerService"
      },
      {
        text: "Pembayaran ke",
        value: "idKasir"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    transaksis: [],
    customers: [],
    pegawais: [],
    details: [],
    produks: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      noTransaksi: "",
      idCustomer: "",
      namaCustomer: "",
      statusPembayaran: "",
      idCS: "",
      namaCS: "",
      idKasir: "",
      namaKasir: "",
      totalBiaya: 0,
      diskon: 0,
      membership: ""
    },
    detailTransaksis: [
      {
        noTransaksi: "",
        idProduk: "",
        namaProduk: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0
      }
    ],
    temp: [],
    transaksi: new FormData(),
    DTTransaksi: new FormData(),
    typeInput: "new",
    statusMember: 0
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "transaksiProduk";
      this.$http.get(uri).then(response => {
        this.transaksis = response.data.transaksiProduk;
      });
    },

    getCustomer() {
      var uri = this.$apiUrl + "customer";
      this.$http.get(uri).then(response => {
        this.customers = response.data.customer;
        this.form.idCustomer = response.data.customer[0].idCustomer;
      });
    },

    getKasir() {
      var uri = this.$apiUrl + "pegawai/kasir/hehe";
      this.$http.get(uri).then(response => {
        this.pegawais = response.data.pegawai;
      });
    },

    getProduk() {
      var uri = this.$apiUrl + "produk";
      this.$http.get(uri).then(response => {
        this.produks = response.data.produk;
      });
    },

    getDetailProduk() {
      var uri = this.$apiUrl + "dtProduk";
      this.$http.get(uri).then(response => {
        this.details = response.data.DTProduk;
      });
    },

    hitungSubTotal(index) {
      var uri =
        this.$apiUrl + `produk/cari/${this.detailTransaksis[index].idProduk}`;
      this.$http.get(uri).then(response => {
        this.detailTransaksis[index].harga = response.data.produk[0].harga;
        this.detailTransaksis[index].subtotal =
          this.detailTransaksis[index].harga *
          this.detailTransaksis[index].jumlah;
      });
    },

    hitungTotal() {
      this.form.totalBiaya = 0;
      for (var i = 0; i < this.detailTransaksis.length; i++) {
        parseInt(
          (this.form.totalBiaya =
            this.form.totalBiaya + this.detailTransaksis[i].subtotal)
        );
      }
      if (this.statusMember == 1) {
        parseInt(
          (this.form.totalBiaya = this.form.totalBiaya - this.form.diskon)
        );
      }
    },

    // sendData() {
    //   var uri = this.$apiUrl + "transaksiProduk";
    //   if (this.statusMember == 1) {
    //     this.transaksi.append("idCustomer", this.form.idCustomer);
    //   }
    //   this.transaksi.append("idCustomerService", this.idCS);
    //   this.transaksi.append("totalBiaya", this.form.totalBiaya);
    //   this.load = true;
    //   this.$http
    //     .post(uri, this.transaksi)
    //     .then(response => {
    //       if (typeInput === "new") {
    //         this.snackbar = true; //mengaktifkan snackbar
    //         this.color = "green"; //memberi warna snackbar
    //         this.text = response.data.status; //memasukkan pesan kesnackbar
    //         this.load = false;
    //         this.dialog = false;
    //         this.getData();
    //       } else {
    //         this.sendDtTransaksi();
    //       }
    //     })
    //     .catch(error => {
    //       this.load = false;
    //       this.dialog = false;
    //       this.getData();
    //     });
    // },

    sendDtTransaksi() {
      var uri;
      var noTransaksi = this.form.noTransaksi;
      for (var i = 0; i < this.detailTransaksis.length; i++) {
        if (this.typeInput == "edit") {
          if (this.cek(noTransaksi, this.detailTransaksis[i].idProduk) == 1)
            uri = this.$apiUrl + "dtProduk/update";
          else uri = this.$apiUrl + "dtProduk";
        } else {
          uri = this.$apiUrl + "dtProduk";
        }

        this.DTTransaksi.append("noTransaksi", noTransaksi);
        this.DTTransaksi.append("idProduk", this.detailTransaksis[i].idProduk);
        this.DTTransaksi.append("jumlah", this.detailTransaksis[i].jumlah);

        this.$http
          .post(uri, this.DTTransaksi)
          .then(response => {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialog = false;
            this.getData();
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
            this.load = false;
          });
      }
    },

    cek($noTransaksi, $idP) {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noTransaksi == $noTransaksi) {
          if (this.details[i].idProduk == $idP) return 1;
        }
      }
      return 0;
    },

    editHandler(item) {
      // this.getDetailByPO(item);
      this.typeInput = "edit";
      this.dialog = true;
      this.noTransaksi = item.noTransaksi;
      this.form.noTransaksi = item.noTransaksi;
      this.form.statusPembayaran = item.statusPembayaran;
      this.form.totalBiaya = item.totalBiaya;
      this.form.diskon = item.diskon;
      for (var i = 0; i < this.customers.length; i++) {
        if (this.customers[i].idCustomer == item.idCustomer) {
          this.form.idCustomer = this.customers[i].idCustomer;
        }
      }
      this.detailTransaksis = [];
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noTransaksi == item.noTransaksi) {
          this.details[i].subtotal =
            this.details[i].jumlah * this.details[i].harga;
          this.details[i].idProduk = this.details[i].idProduk;
          this.detailTransaksis.push(this.details[i]);
        }
      }
    },

    updateData() {
      this.transaksi.append("statusPembayaran", this.form.statusPembayaran);
      this.transaksi.append("idKasir", this.idKasir);
      this.transaksi.append("totalBiaya", this.form.totalBiaya);
      this.transaksi.append("diskon", this.form.diskon);

      var uri = this.$apiUrl + `transaksiProduk/kasir/${this.noTransaksi}`;
      this.load = true;
      this.$http
        .post(uri, this.transaksi)
        .then(response => {
          this.updateStok();
          this.sendDtTransaksi();
          if (this.form.statusPembayaran == "Sudah Bayar") {
            this.print(this.form.noTransaksi);
          }
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
          this.load = false;
          this.dialog = false;
          this.typeInput = "new";
        });
    },

    deleteData(noTransaksi) {
      var uri;
      if (confirm("Apakah Anda ingin menghapus Transaksi ini?")) {
        uri = this.$apiUrl + "transaksiProduk/" + noTransaksi;
        this.$http
          .delete(uri, this.transaksi)
          .then(response => {
            this.snackbar = true;
            this.text = response.data.status;
            this.color = "green";
            this.restoreStok();
            this.getData();
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
          });
      } else {
        this.snackbar = true;
        this.text = "Gagal dihapus.";
        this.color = "red";
      }
    },

    deleteDetailProduk(index) {
      var uri = this.$apiUrl + "dtProduk/delete";
      var noTransaksi = this.form.noTransaksi;
      var idProduk = this.detailTransaksis[index].idProduk;

      this.DTTransaksi.append("noTransaksi", noTransaksi);
      this.DTTransaksi.append("idProduk", idProduk);
      this.$http
        .post(uri, this.DTTransaksi)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.status;
          this.color = "green";
          this.restoreStok();
          this.getData();
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
        });
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else {
        this.updateData();
      }
    },

    resetForm() {
      this.typeInput = "new";

      this.form = {
        noTransaksi: "",
        idCustomer: "",
        namaCustomer: "",
        statusPembayaran: "",
        idCS: "",
        namaCS: "",
        idKasir: "",
        namaKasir: "",
        totalBiaya: 0,
        membership: ""
      };
    },

    resetDynamicForm() {
      while (this.detailTransaksis.length != 0) {
        for (var i = 0; i < this.detailTransaksis.length; i++) {
          this.detailTransaksis.splice(this.detailTransaksis[i], 1);
          this.temp.push(this.detailTransaksis[i]);
          console.log(this.temp);
        }
      }
    },
    deleteRow(index) {
      this.detailTransaksis.splice(index, 1);
    },

    addRow() {
      this.detailTransaksis.push({
        namaProduk: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0
      });
    },

    updateStok() {
      var stok;
      var temp;

      for (var i = 0; i < this.detailTransaksis.length; i++) {
        var id = this.detailTransaksis[i].idProduk;
        var uri = this.$apiUrl + `produk/cari/${id}`;
        var uri2 = this.$apiUrl + `produk/updateStok/${id}`;
        var jumlah = this.detailTransaksis[i].jumlah;
        this.$http.get(uri).then(response => {
          stok = parseInt(response.data.produk[0].stok);
          temp = stok - parseInt(jumlah);
          this.DTTransaksi.append("stok", temp);
          this.DTTransaksi.append("idPegawaiLog", this.idKasir);
          this.$http.post(uri2, this.DTTransaksi);
        });
      }
    },

    restoreStok() {
      var stok;
      var temp;

      for (var i = 0; i < this.detailTransaksis.length; i++) {
        var id = this.detailTransaksis[i].idProduk;
        var jumlah = this.detailTransaksis[i].jumlah;
        var uri = this.$apiUrl + `produk/cari/${id}`;
        var uri2 = this.$apiUrl + `produk/updateStok/${id}`;
        this.$http.get(uri).then(response => {
          stok = parseInt(response.data.produk[0].stok);
          temp = stok + parseInt(jumlah);
          this.DTTransaksi.append("stok", temp);
          this.DTTransaksi.append("idPegawaiLog", this.idKasir);
          this.$http.post(uri2, this.DTTransaksi);
        });
      }
    },

    print(noTransaksi) {
      var uri = this.$apiUrl + "transaksiProduk/cetak/" + noTransaksi;
      this.$http
        .get(uri, { responseType: "blob" }, this.DTTransaksi)
        .then(response => {
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
          this.getData();
        })
        .catch(error => {});
    }
  },

  mounted() {
    this.getData();
    this.getKasir();
    this.getProduk();
    this.getCustomer();
    this.getDetailProduk();
    this.idKasir = this.$session.get("NIP");
  }
};
</script>
