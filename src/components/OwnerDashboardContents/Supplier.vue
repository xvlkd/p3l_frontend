<template>
  <v-container>
    <v-card width="100%">
      <v-container grid-list-md mb-0>
        <h2 class="text-md-center">{{this.judul}}</h2>
        <v-layout row wrap style="margin:10px">
          <v-flex xs6>
            <v-btn
              depressed
              dark
              rounded
              style="text-transform: none !important;"
              color="green accent-3"
              @click="dialog=true"
              class="mr-4"
              v-if="status === 1"
            >
              <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>Tambah Supplier
            </v-btn>

            <v-btn
              depressed
              dark
              rounded
              style="text-transform: none !important;"
              color="green accent-3"
              @click="deletedData()"
            >
              <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>
              {{this.btnLog}}
            </v-btn>
          </v-flex>
          <v-flex xs6 class="text-right">
            <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
          </v-flex>
        </v-layout>

        <v-data-table :headers="headers" :items="suppliers" :search="keyword" :loading="load">
          <template v-slot:item.actions="{ item }">
            <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
            <v-icon color="error" @click="deleteData(item.idSupplier)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

    <!-- edit dialog -->
    <v-dialog v-model="dialog" presistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-rename-box"
                  label="Nama Supplier*"
                  v-model="form.namaSupplier"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-cash-usd"
                  label="Alamat*"
                  v-model="form.alamat"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-earth-box"
                  label="Nomor Handphone*"
                  type="number"
                  v-model="form.noHp"
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
          <v-btn color="blue darken-1" text @click="setForm()">{{this.btnDialog}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- dialog soft delete -->
    <v-dialog v-model="dialogSoftDelete" presistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list-item-content>
                  <v-list-item-subtitle>ID Supplier: {{ form.idSupplier }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Nama Supplier: {{ form.namaSupplier }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Alamat Supplier: {{ form.alamat }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Nomor Handphone: {{ form.noHp }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="restore()">{{this.btnDialog}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
      {{ text }}
      <v-btn dark text @click="snackbar=false">Tutup</v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    items: [],
    keyword: "",
    headers: [
      {
        text: "ID Supplier",
        value: "idSupplier"
      },
      {
        text: "Nama Supplier",
        value: "namaSupplier"
      },
      {
        text: "Alamat",
        value: "alamat"
      },
      {
        text: "No HP",
        value: "noHp"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    suppliers: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      namaSupplier: "",
      alamat: "",
      noHp: "",
      idPegawaiLog: "Owner"
    },
    supplier: new FormData(),
    typeInput: "new",
    errors: "",
    konfirmasi: false,
    status: 1,
    judul: "Data Supplier",
    btnLog: "Tampil Log Hapus",
    btnDialog: "Save",
    dialogSoftDelete: false
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "supplier";
      this.$http.get(uri, this.suppliers).then(response => {
        this.suppliers = response.data.supplier;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "supplier/softDelete";
      this.$http.get(uri, this.suppliers).then(response => {
        this.suppliers = response.data.supplier;
      });
    },

    sendData() {
      this.supplier.append("namaSupplier", this.form.namaSupplier);
      this.supplier.append("alamat", this.form.alamat);
      this.supplier.append("noHp", this.form.noHp);
      this.supplier.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "supplier";
      this.load = true;
      this.$http
        .post(uri, this.supplier)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan kesnackbar
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
      if (this.status == 1) {
        this.typeInput = "edit";
        this.dialog = true;
        this.idSupplier = item.idSupplier;
        this.form.namaSupplier = item.namaSupplier;
        this.form.alamat = item.alamat;
        this.form.noHp = item.noHp;
      } else {
        this.dialogSoftDelete = true;
        this.idSupplier = item.idSupplier;
        this.form.idSupplier = item.idSupplier;
        this.form.namaSupplier = item.namaSupplier;
        this.form.alamat = item.alamat;
        this.form.noHp = item.noHp;
      }
    },

    updateData() {
      this.supplier.append("namaSupplier", this.form.namaSupplier);
      this.supplier.append("alamat", this.form.alamat);
      this.supplier.append("noHp", this.form.noHp);
      this.supplier.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + `supplier/${this.idSupplier}`;
      this.load = true;
      this.$http
        .post(uri, this.supplier)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan ke snackbar
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

    deleteData(idSupplier) {
      var uri;

      if (this.status == 1) {
        uri = this.$apiUrl + "supplier/" + idSupplier;
      } else {
        uri = this.$apiUrl + "supplier/" + idSupplier + "/permanen"; //data dihapus berdasarkan id
      }
      this.$http
        .delete(uri)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.dialog = false;
          if (this.status == 1) {
            this.getData();
          } else {
            this.getDataSoftDelete();
          }
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
      } else if (this.status == 0) {
        this.restore();
      } else {
        this.updateData();
      }
    },

    resetForm() {
      this.form = {
        namaSupplier: "",
        alamat: "",
        noHp: "",
        idPegawaiLog: "Owner"
      };
    },

    // openDialog() {
    //   this.konfirmasi = true;
    // }

    deletedData() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Supplier";
        this.btnLog = "Tampil Log Hapus";
        this.btnDialog = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Supplier Yang Dihapus";
        this.btnLog = "Tampil Supplier";
        this.btnDialog = "Restore";
      }
    },

    restore() {
      this.supplier.append("namaSupplier", this.form.namaSupplier);
      this.supplier.append("alamat", this.form.alamat);
      this.supplier.append("noHp", this.form.noHp);
      this.supplier.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + `supplier/${this.idSupplier}/restore`;

      this.load = true;
      this.$http
        .post(uri, this.supplier)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan ke snackbar
          this.load = false;
          this.dialogSoftDelete = false;
          if (this.status == 0) {
            this.getDataSoftDelete();
          } else {
            this.getData();
          }
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
          this.load = false;
          this.dialogSoftDelete = false;
        });
    }
  },

  mounted() {
    this.getData();
  }
};
</script>