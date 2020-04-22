<template>
  <v-data-table :headers="headers" :items="layanans" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>{{judul}}</v-toolbar-title>
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
          v-if="status === 1"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah layanan
        </v-btn>

        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="green accent-3"
          @click="setLayanan()"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>
          {{btnLog}}
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" presistent max-width="400">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-rename-box"
                    label="Nama layanan*"
                    v-model="form.namaLayanan"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-cash-usd"
                    label="Harga*"
                    v-model="form.harga"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="ukurans"
                    item-text="namaUkuran"
                    item-value="idUkuran"
                    label="Ukuran Hewan"
                    prepend-icon="mdi-format-size"
                    dense
                    v-model="form.idUkuran"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="dialogSoftDelete" presistent max-width="400">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-list-item-content>
                    <v-list-item-subtitle>ID Layanan: {{ form.idLayanan }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Nama Layanan: {{ form.namaLayanan }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Harga: {{ form.harga }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Ukuran Hewan: {{ form.namaUkuran }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="restoreData()">{{btnDialog}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.idLayanan)">mdi-delete</v-icon>
    </template>-->
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
        text: "ID layanan",
        value: "idLayanan"
      },
      {
        text: "Nama layanan",
        value: "namaLayanan"
      },
      {
        text: "Harga",
        value: "harga"
      },
      {
        text: "Ukuran Hewan",
        value: "namaUkuran"
      },
      {
        text: "Ditambahkan Oleh",
        value: "idPegawaiLog"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    load: false,
    layanans: [],
    ukurans: [],
    idPegawaiLog: "",
    form: {
      idLayanan: "",
      namaLayanan: "",
      harga: "",
      idUkuran: "",
      namaUkuran: "",
      idPegawaiLog: "Owner"
    },
    layanan: new FormData(),
    typeInput: "new",
    status: 1,
    judul: "Data Layanan",
    btnLog: "Tampil Log Hapus",
    btnDialog: "Save",
    dialogSoftDelete: false
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "layanan";
      this.$http.get(uri, this.layanan).then(response => {
        this.layanans = response.data.layanan;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "layanan/softDelete";
      this.$http.get(uri, this.layanan).then(response => {
        this.layanans = response.data.layanan;
      });
    },

    getUkuran() {
      var uri = this.$apiUrl + "ukuranHewan";
      this.$http.get(uri, this.ukuran).then(response => {
        this.ukurans = response.data.ukuran;
        this.form.idUkuran = response.data.ukuran[0].idUkuran;
      });
    },

    sendData() {
      this.layanan.append("namaLayanan", this.form.namaLayanan);
      this.layanan.append("harga", this.form.harga);
      this.layanan.append("idUkuran", this.form.idUkuran);
      this.layanan.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "layanan";
      this.load = true;
      this.load = true;
      this.$http
        .post(uri, this.layanan)
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

    updateData() {
      this.layanan.append("namaLayanan", this.form.namaLayanan);
      this.layanan.append("harga", this.form.harga);
      this.layanan.append("idUkuran", this.form.idUkuran);
      this.layanan.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + "layanan/update/" + this.form.idLayanan;
      this.load = true;
      this.$http
        .post(uri, this.layanan)
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

    deleteData(idLayanan) {
      var uri;

      if (this.status == 1) {
        this.layanan.append("idPegawaiLog", this.idPegawaiLog);

        uri = this.$apiUrl + `layanan/${idLayanan}`;
        if (confirm("Apakah Anda ingin Menghapus Layanan ini?")) {
          this.load = true;
          this.$http
            .post(uri, this.layanan)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
              this.getData();
            })
            .catch(error => {
              this.errors = error;
              this.snackbar = true;
              this.text = "Try Again";
              this.color = "red";
            });
          this.load = false;
        } else {
          this.snackbar = true;
          this.text = "Data Layanan gagal dihapus.";
          this.color = "red";
        }
      } else {
        uri = this.$apiUrl + "layanan/" + idLayanan + "/permanen"; //data dihapus berdasarkan id
        if (
          confirm("Apakah Anda ingin Menghapus Layanan ini secara permanen?")
        ) {
          this.load = true;
          this.$http
            .delete(uri)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
              this.getDataSoftDelete();
            })
            .catch(error => {
              this.errors = error;
              this.snackbar = true;
              this.text = "Try Again";
              this.color = "red";
            });
          this.load = false;
        } else {
          this.snackbar = true;
          this.text = "Data Layanan gagal dihapus secara permanen.";
          this.color = "red";
        }
      }
    },

    restoreData() {
      this.layanan.append("namaLayanan", this.form.namaLayanan);
      this.layanan.append("harga", this.form.harga);
      this.layanan.append("idUkuran", this.form.idUkuran);
      this.layanan.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `layanan/${this.form.idLayanan}/restore`;
      if (confirm("Apakah Anda ingin memulihkan Layanan ini?")) {
        this.load = true;
        this.$http
          .post(uri, this.layanan)
          .then(response => {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.message; //memasukkan pesan ke snackbar
            this.load = false;
            this.dialogSoftDelete = false;
            this.getDataSoftDelete();
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
            this.load = false;
            this.dialogSoftDelete = false;
          });
      } else {
        this.snackbar = true;
        this.text = "Memulihkan data Layanan gagal.";
        this.color = "red";
      }
    },

    editHandler(item) {
      if (this.status == 1) {
        this.typeInput = "edit";
        this.dialog = true;
        this.form.idLayanan = item.idLayanan;
        this.form.namaLayanan = item.namaLayanan;
        this.form.harga = item.harga;
        for (var i = 0; i < this.ukurans.length; i++) {
          if (this.ukurans[i].idUkuran == item.idUkuran) {
            this.form.idUkuran = this.ukurans[i].idUkuran;
          }
        }
      } else {
        this.dialogSoftDelete = true;
        this.form.idLayanan = item.idLayanan;
        this.form.namaLayanan = item.namaLayanan;
        this.form.namaUkuran = item.namaUkuran;
        this.form.harga = item.harga;
        for (var i = 0; i < this.ukurans.length; i++) {
          if (this.ukurans[i].idUkuran == item.idUkuran) {
            this.form.namaUkuran = this.ukurans[i].namaUkuran;
          }
        }
      }
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
        this.dialog = false;
      } else {
        this.updateData();
        this.dialog = false;
        this.typeInput === "new";
      }
    },

    resetForm() {
      this.form = {
        namaLayanan: "",
        harga: "",
        idUkuran: "",
        idPegawaiLog: "Owner"
      };
    },

    setLayanan() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Layanan";
        this.btnLog = "Tampil Log Hapus";
        this.btnDialog = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Layanan Yang Dihapus";
        this.btnLog = "Tampil Layanan";
        this.btnDialog = "Restore";
      }
    }
  },

  mounted() {
    this.getData();
    this.getUkuran();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>