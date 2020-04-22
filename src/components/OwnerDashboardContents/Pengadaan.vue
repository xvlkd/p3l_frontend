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

      <v-dialog v-model="dialog" presistent max-width="400">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="suppliers"
                    item-text="namaSupplier"
                    item-value="idSupplier"
                    prepend-icon="mdi-rename-box"
                    label="ID Supplier*"
                    dense
                    v-model="form.idSupplier"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <div v-if="typeInput === 'edit'">
                    Status Pengadaan
                    <v-spacer />
                    <input type="radio" value="Belum Datang" v-model="form.statusPengadaan" />
                    Belum Datang
                    <input
                      type="radio"
                      value="Sudah Datang"
                      v-model="form.statusPengadaan"
                    />
                    Sudah Datang
                  </div>
                  <!-- <v-radio-group row v-if="typeInput === 'edit'" label="Status Pengadaan*">
                    <v-radio :items="opsi" v-model="form.statusPengadaan"></v-radio>
                  </v-radio-group>-->
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-rename-box"
                    label="Total Harga*"
                    v-model="form.totalHarga"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Close</v-btn>
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
    snackbar: false,
    color: null,
    text: "",
    status: 0,
    load: false,
    form: {
      idSupplier: "",
      namaSupplier: "",
      statusPengadaan: "",
      totalHarga: ""
    },
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

    sendData() {
      var uri = this.$apiUrl + "transaksiPengadaan";
      this.load = true;
      this.$http
        .post(uri, this.pengadaan)
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
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.noPO = item.noPO;
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
      this.form = {
        idSupplier: ""
      };
    },

    produkMin() {
      this.$router.push({ name: "ProdukMinimal" });
    },

    print() {
      this.status = 1;
    }
  },

  mounted() {
    this.getData();
    this.getSupplier();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>

          