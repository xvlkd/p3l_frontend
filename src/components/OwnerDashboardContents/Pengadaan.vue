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
          color="green accent-3"
          @click="produkMin()"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tampil Produk Minimal
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" persistent max width="1200">
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
                    label="ID Supplier*"
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
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="detailProduk.idProduk"
                      :items="produks"
                      item-text="namaProduk"
                      item-value="idProduk"
                      label="Nama Produk*"
                      @change="hitungSubTotal(index)"
                      required
                      outlined
                      rounded
                    ></v-autocomplete>
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

                  <v-col cols="3">
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

                  <v-col cols="1" v-if="statusDetail === 0">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <div v-on="on">
                          <v-btn
                            color="red lighten-2"
                            icon
                            @click="deleteRow(detailProduk), hitungTotal()"
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
                <v-col cols="1" v-if="statusDetail === 0" align-end justify-end>
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-btn color="green" icon fab @click="addRow(), getProduk()">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span>Tambah Produk</span>
                  </v-tooltip>
                </v-col>

                <!-- <v-col cols="1" v-if="statusDetail === 0">
                  <v-tooltip top>
                    <template v-slot:activator="{ on }">
                      <div v-on="on">
                        <v-btn color="purple" icon fab @click="hitungTotal(), statusDetail=1">
                          <v-icon>mdi-checkbox-marked</v-icon>
                        </v-btn>
                      </div>
                    </template>
                    <span>Done</span>
                  </v-tooltip>
                </v-col>-->
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
      <v-icon color="teal" @click="print(item)">mdi-printer</v-icon>
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
    snackbar: false,
    color: null,
    text: "",
    status: 0,
    statusDetail: 0,
    load: false,
    form: {
      idSupplier: "",
      namaSupplier: "",
      statusPengadaan: "",
      totalHarga: 0
    },
    detailProduks: [
      {
        idProduk: "",
        namaProduk: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0
      }
    ],
    pengadaan: new FormData(),
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
        this.form.idSupplier = response.data.supplier[0].idSupplier;
      });
    },

    getProduk() {
      var uri = this.$apiUrl + "produk/minimal";
      this.$http.get(uri, this.produk).then(response => {
        this.produks = response.data.produk;
      });
    },

    getDetailProduk() {
      var uri = this.$apiUrl + "dtPengadaan";
      this.$http.get(uri).then(response => {
        this.details = response.data.DTPengadaan;
      });
    },

    hitungSubTotal(index) {
      var uri =
        this.$apiUrl + `produk/cari/${this.detailProduks[index].idProduk}`;
      this.$http.get(uri, this.produk).then(response => {
        this.produks = response.data.produk;
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
      this.load = true;
      this.$http
        .post(uri, this.pengadaan)
        .then(response => {
          this.sendDtPengadaan();
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.status; //memasukkan pesan kesnackbar
          this.load = false;
          this.dialog = false;
          this.getData(); //mengambil data
          this.resetForm();
          this.resetDynamicForm();
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
          this.load = false;
        });
    },

    sendDtPengadaan() {
      var uri2 = this.$apiUrl + "dtPengadaan";

      for (var i = 0; i < this.detailProduks.length; i++) {
        this.$http
          .post(uri, this.detailProduks[i])
          .then(response => {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialog = false;
            this.getData(); //mengambil data
            this.resetForm();
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
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.status; //memasukkan pesan ke snackbar
          this.load = false;
          this.dialog = false;
          this.getData();
          this.resetForm();
          this.typeInput = "new";
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

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else {
        this.updateData();
      }
    },

    resetForm() {
      this.typeInput = "new";
      this.statusDetail = 0;
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
        }
      }
    },

    produkMin() {
      this.$router.push({ name: "ProdukMinimal" });
    },

    print() {
      this.status = 1;
    },

    deleteRow(index) {
      this.detailProduks.splice(this.detailProduks.indexOf(index), 1);
    },

    addRow() {
      this.detailProduks.push({
        namaProduk: "",
        jumlah: "",
        harga: "",
        subtotal: ""
      });
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


<style scoped>
.flex {
  display: flex;
}

/* .custom-placeholer-color input::placeholder {
  color: red!important;
  opacity: 1;
} */

.custom-label-color .v-label {
  color: black;
  opacity: 1;
}

/* .custom-placeholer-color input,
.custom-label-color input{
  color: blue!important;
} */
</style>