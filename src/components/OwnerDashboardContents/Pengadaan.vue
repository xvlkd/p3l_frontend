<template>
  <v-data-table :headers="headers" :items="pengadaans" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Pengadaan Produk</v-toolbar-title>
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
          @click="dialog=true"
          class="mr-4"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Pengadaan
        </v-btn>

        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="indigo accent-3"
          @click="produkMin()"
        >
          <v-icon size="10" class="mr-2">mdi-emoticon-happy</v-icon>Tampil Produk Minimal
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" hide-overlay max width="1200">
        <!-- persistent -->
        <v-card>
          <v-card-text>
            <v-container>
              <v-col cols="4">
                Data Transaksi Pengadaan
                <v-text-field
                  class="mt-4"
                  v-if="typeInput === 'edit'"
                  v-model="form.noPO"
                  label="Nomor PO"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>
              <v-row row>
                <v-col cols="4">
                  <v-select
                    :items="suppliers"
                    item-text="namaSupplier"
                    item-value="idSupplier"
                    label="Supplier*"
                    dense
                    outlined
                    rounded
                    v-model="form.idSupplier"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="4">
                  <div v-if="typeInput === 'edit'">
                    Status Pengadaan*
                    <v-radio-group v-model="form.statusPengadaan" row>
                      <v-radio label="Belum Datang" value="Belum Datang"></v-radio>
                      <v-radio label="Sudah Datang" value="Sudah Datang"></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>

                <v-col cols="4">
                  <div v-if="typeInput === 'edit'">
                    <v-text-field
                      label="Total Harga"
                      v-model.number="form.totalHarga"
                      background-color="blue-grey darken-1"
                      type="number"
                      prefix="Rp"
                      readonly
                      filled
                      rounded
                    ></v-text-field>
                  </div>
                </v-col>
              </v-row>
            </v-container>

            <v-divider />

            <v-container class="mt-4" v-if="typeInput === 'edit'">
              Data Produk
              <div class="form-row" v-for="(detailProduk, index) in detailProduks" :key="index">
                <v-row>
                  <v-col cols="3">
                    <v-autocomplete
                      v-model="detailProduk.idProduk"
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
                    <v-text-field v-model="detailProduk.satuan" label="Satuan*" outlined rounded></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="detailProduk.jumlah"
                      required
                      type="number"
                      label="Jumlah*"
                      @change="hitungSubTotal(index),hitungTotal()"
                      clearable
                      outlined
                      rounded
                    ></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="detailProduk.harga"
                      label="Harga"
                      readonly
                      outlined
                      rounded
                      prefix="Rp"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="2">
                    <v-text-field
                      v-model="detailProduk.subtotal"
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
                            @click="hitungTotal(), deleteDetailProduk(index), deleteRow(index)"
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
      <v-icon color="error" @click="deleteData(item.noPO)">mdi-delete</v-icon>
      <v-icon color="teal" @click="print(item.noPO)">mdi-printer</v-icon>
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
        text: "No. PO",
        value: "noPO"
      },
      {
        text: "Tanggal Pengadaan",
        value: "tglPengadaan"
      },
      {
        text: "Supplier",
        value: "namaSupplier"
      },
      {
        text: "Total Harga",
        value: "totalHarga"
      },
      {
        text: "Status Pengadaan",
        value: "statusPengadaan"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    pengadaans: [],
    suppliers: [],
    produks: [],
    details: [],
    itemss: [],
    snackbar: false,
    color: null,
    text: "",
    status: 0,
    load: false,
    form: {
      idSupplier: "",
      namaSupplier: "",
      statusPengadaan: "",
      statusCetak: "",
      totalHarga: 0
    },
    form2: {
      idProduk: "",
      namaProduk: "",
      jumlah: "",
      satuan: "",
      subtotal: 0
    },
    detailProduks: [
      {
        noPO: "",
        idProduk: "",
        namaProduk: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0,
        satuan: ""
      }
    ],
    temp: [],
    pengadaan: new FormData(),
    DTPengadaan: new FormData(),
    typeInput: "new"
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "transaksiPengadaan";
      this.$http.get(uri, this.pengadaan).then(response => {
        this.pengadaans = response.data.transaksiPengadaan;
      });
    },

    getSupplier() {
      var uri = this.$apiUrl + "supplier";
      this.$http.get(uri, this.supplier).then(response => {
        this.suppliers = response.data.supplier;
        // this.form.idSupplier = response.data.supplier[0].idSupplier;
      });
    },

    getProduk() {
      var uri = this.$apiUrl + "produk/minimal";
      this.$http.get(uri).then(response => {
        this.produks = response.data.produk;
      });
    },

    getDetailProduk() {
      var uri = this.$apiUrl + "dtPengadaan";
      this.$http.get(uri).then(response => {
        this.details = response.data.DTPengadaan;
      });
    },

    getDetailByPO(item) {
      this.form.noPO = item.noPO;
      var uri = this.$apiUrl + "dtPengadaan/tampil/" + item.noPO;
      this.$http.get(uri).then(response => {
        this.itemss = response.data.DTPengadaan;
      });
      this.dialog = true;
    },

    hitungSubTotal(index) {
      var uri =
        this.$apiUrl + `produk/cari/${this.detailProduks[index].idProduk}`;
      this.$http.get(uri, this.produk).then(response => {
        this.detailProduks[index].harga = response.data.produk[0].harga;
        this.detailProduks[index].subtotal =
          this.detailProduks[index].harga * this.detailProduks[index].jumlah;
      });
    },

    hitungTotal() {
      this.form.totalHarga = 0;
      for (var i = 0; i < this.detailProduks.length; i++) {
        parseInt(
          (this.form.totalHarga =
            this.form.totalHarga + this.detailProduks[i].subtotal)
        );
      }
    },

    sendData() {
      var uri = this.$apiUrl + "transaksiPengadaan";
      this.pengadaan.append("idSupplier", this.form.idSupplier);
      this.load = true;
      this.$http
        .post(uri, this.pengadaan)
        .then(response => {
          if (typeInput === "new") {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialog = false;
            this.getData();
          } else {
            this.sendDtPengadaan();
          }
        })
        .catch(error => {
          this.load = false;
          this.dialog = false;
          this.getData();
        });
    },

    sendDtPengadaan() {
      var uri;
      var noPO = this.form.noPO;
      for (var i = 0; i < this.detailProduks.length; i++) {
        if (this.typeInput === "edit") {
          if (this.cek(noPO, this.detailProduks[i].idProduk) == 1)
            uri = this.$apiUrl + "dtPengadaan/update";
          else uri = this.$apiUrl + "dtPengadaan";
        } else {
          uri = this.$apiUrl + "dtPengadaan";
        }

        this.DTPengadaan.append("noPO", noPO);
        this.DTPengadaan.append("idProduk", this.detailProduks[i].idProduk);
        this.DTPengadaan.append("jumlah", this.detailProduks[i].jumlah);
        this.DTPengadaan.append("satuan", this.detailProduks[i].satuan);

        this.$http
          .post(uri, this.DTPengadaan)
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

    cek($noPO, $idP) {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noPO == $noPO) {
          if (this.details[i].idProduk == $idP) return 1;
        }
      }
      return 0;
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.noPO = item.noPO;
      this.form.noPO = item.noPO;
      this.form.statusPengadaan = item.statusPengadaan;
      this.form.totalHarga = item.totalHarga;
      for (var i = 0; i < this.suppliers.length; i++) {
        if (this.suppliers[i].idSupplier == item.idSupplier) {
          this.form.idSupplier = this.suppliers[i].idSupplier;
        }
      }
      this.detailProduks = [];
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noPO == item.noPO) {
          this.details[i].subtotal =
            this.details[i].jumlah * this.details[i].harga;
          this.detailProduks.push(this.details[i]);
        }
      }
    },

    updateData() {
      this.pengadaan.append("idSupplier", this.form.idSupplier);
      this.pengadaan.append("statusPengadaan", this.form.statusPengadaan);
      this.pengadaan.append("totalHarga", this.form.totalHarga);

      var uri = this.$apiUrl + `transaksiPengadaan/${this.noPO}`;
      this.load = true;
      this.$http
        .post(uri, this.pengadaan)
        .then(response => {
          this.updateStok();
          this.sendDtPengadaan();
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

    deleteData(noPO) {
      var uri;

      if (confirm("Apakah Anda ingin menghapus Pengadaan ini?")) {
        uri = this.$apiUrl + "transaksiPengadaan/" + noPO;
        this.$http
          .delete(uri, this.pengadaan)
          .then(response => {
            this.snackbar = true;
            this.text = response.data.status;
            this.color = "green";
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
      var uri = this.$apiUrl + "dtPengadaan/delete";
      var noPO = this.form.noPO;
      var idProduk = this.detailProduks[index].idProduk;

      this.DTPengadaan.append("noPO", noPO);
      this.DTPengadaan.append("idProduk", idProduk);
      this.$http
        .post(uri, this.DTPengadaan)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.status;
          this.color = "green";
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
        idSupplier: "",
        namaSupplier: "",
        statusPengadaan: "",
        totalHarga: 0
      };
    },

    resetDynamicForm() {
      while (this.detailProduks.length != 0) {
        for (var i = 0; i < this.detailProduks.length; i++) {
          this.detailProduks.splice(this.detailProduks[i], 1);
          this.temp.push(this.detailProduks[i]);
          console.log(this.temp);
        }
      }
    },

    produkMin(noPO) {
      this.$router.push({ name: "ProdukMinimal" });
    },

    print(noPO) {
      var uri = this.$apiUrl + "transaksiPengadaan/cetak/" + noPO;
      this.DTPengadaan.append("statusCetak", "Sudah Dicetak");
      this.$http
        .get(uri, { responseType: "blob" }, this.DTPengadaan)
        .then(response => {
          const file = new Blob([response.data], { type: "application/pdf" });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //Open the URL on new Window
          window.open(fileURL);
          this.getData();
        })
        .catch(error => {});
    },

    deleteRow(index) {
      this.detailProduks.splice(index, 1);
    },

    addRow() {
      this.detailProduks.push({
        namaProduk: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0,
        satuan: ""
      });
    },

    updateStok() {
      var stok;
      var temp;
      if (this.form.statusPengadaan == "Sudah Datang") {
        for (var i = 0; i < this.detailProduks.length; i++) {
          var id = this.detailProduks[i].idProduk;
          var uri = this.$apiUrl + `produk/cari/${id}`;
          var uri2 = this.$apiUrl + `produk/updateStok/${id}`;
          var jumlah = this.detailProduks[i].jumlah;
          this.$http.get(uri).then(response => {
            stok = parseInt(response.data.produk[0].stok);
            temp = stok + parseInt(jumlah);
            this.DTPengadaan.append("stok", temp);
            this.DTPengadaan.append("idPegawaiLog", this.idPegawaiLog);
            this.$http.post(uri2, this.DTPengadaan);
          });
        }
      }
    }
  },

  mounted() {
    this.getData();
    this.getProduk();
    this.getSupplier();
    this.getDetailProduk();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>
