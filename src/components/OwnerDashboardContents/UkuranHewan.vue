<template>
  <v-data-table :headers="headers" :items="ukurans" :search="keyword" :loading="load">
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
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Ukuran
        </v-btn>

        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="blue accent-3"
          @click="deletedData()"
        >
          <v-icon size="10" class="mr-2">mdi-delete</v-icon>
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
                    label="Ukuran Hewan*"
                    v-model="form.namaUkuran"
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

      <v-dialog v-model="dialogSoftDelete" presistent max-width="400">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-list-item-content>
                    <v-list-item-subtitle>ID Ukuran Hewan: {{ form.idUkuran }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Nama Ukuran Hewan: {{ form.namaUkuran }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="restore()">{{btnDialog}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
        {{ text }}
        <v-btn dark text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.idUkuran)">mdi-delete</v-icon>
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
        text: "ID Ukuran Hewan",
        value: "idUkuran"
      },
      {
        text: "Nama Ukuran Hewan",
        value: "namaUkuran"
      },
      {
        text: "Created By",
        value: "idPegawaiLog"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    ukurans: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      namaUkuran: "",
      idPegawaiLog: "Owner"
    },
    ukuran: new FormData(),
    typeInput: "new",
    errors: "",
    status: 1,
    judul: "Data Ukuran Hewan",
    btnLog: "Tampil Log Hapus",
    btnDialog: "Save",
    dialogSoftDelete: false,
    idPegawaiLog: ""
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "ukuranHewan";
      this.$http.get(uri, this.ukuran).then(response => {
        this.ukurans = response.data.ukuran;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "ukuranHewan/softDelete";
      this.$http.get(uri, this.ukuran).then(response => {
        this.ukurans = response.data.ukuran;
      });
    },

    sendData() {
      this.ukuran.append("namaUkuran", this.form.namaUkuran);
      this.ukuran.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "ukuranHewan";
      this.load = true;
      this.$http
        .post(uri, this.ukuran)
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
        this.idUkuran = item.idUkuran;
        this.form.namaUkuran = item.namaUkuran;
        this.form.idPegawaiLog = item.idPegawaiLog;
      } else {
        this.dialogSoftDelete = true;
        this.idUkuran = item.idUkuran;
        this.form.idUkuran = item.idUkuran;
        this.form.namaUkuran = item.namaUkuran;
        this.form.idPegawaiLog = item.idPegawaiLog;
      }
    },

    updateData() {
      this.ukuran.append("namaUkuran", this.form.namaUkuran);
      this.ukuran.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `ukuranHewan/update/${this.idUkuran}`;
      this.load = true;
      this.$http
        .post(uri, this.ukuran)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan ke snackbar
          this.load = false;
          this.dialog = false;
          this.getData(); //mengambil data
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

    deleteData(idUkuran) {
      var uri;
      this.ukuran.append("idPegawaiLog", this.idPegawaiLog);

      if (this.status == 1) {
        if (confirm("Apakah Anda ingin menghapus Ukuran Hewan ini?")) {
          uri = this.$apiUrl + "ukuranHewan/" + idUkuran; //data dihapus berdasarkan id
          this.$http
            .post(uri, this.ukuran)
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
        } else {
          this.snackbar = true;
          this.text = "Gagal dihapus.";
          this.color = "red";
        }
      } else {
        if (
          confirm(
            "Apakah Anda ingin menghapus Ukuran Hewan ini secara permanen?"
          )
        ) {
          uri = this.$apiUrl + "ukuranHewan/" + idUkuran + "/permanen";
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
        } else {
          this.snackbar = true;
          this.text = "Gagal dihapus permanen.";
          this.color = "red";
        }
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
        namaUkuran: "",
        idPegawaiLog: "Owner"
      };
    },

    deletedData() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Ukuran Hewan";
        this.btnLog = "Tampil Log Hapus";
        this.btnDialog = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Ukuran Hewan Yang Dihapus";
        this.btnLog = "Tampil Ukuran Hewan";
        this.btnDialog = "Restore";
      }
    },

    restore() {
      this.ukuran.append("namaUkuran", this.form.namaUkuran);
      this.ukuran.append("idPegawaiLog", "Owner");

      var uri = this.$apiUrl + `ukuranHewan/${this.idUkuran}/restore`;

      if (confirm("Apakah Anda ingin memulihkan Ukuran Hewan ini?")) {
        this.load = true;
        this.$http
          .post(uri, this.ukuran)
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
      } else {
        this.snackbar = true;
        this.text = "Memulihkan data gagal.";
        this.color = "red";
      }
    }
  },

  mounted() {
    this.getData();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>