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
              <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>Tambah Jenis Hewan
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

        <v-data-table :headers="headers" :items="jenises" :search="keyword" :loading="load">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.idJenis">
                <td>{{ item.idJenis }}</td>
                <td>{{ item.namaJenis }}</td>
                <td>{{ item.idPegawaiLog }}</td>
                <td>
                  <v-btn icon color="indigo" light @click="editHandler(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="error" light @click="deleteData(item.idJenis)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-rename-box"
                  label="Jenis Hewan*"
                  v-model="form.namaJenis"
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

    <v-dialog v-model="dialogSoftDelete" persistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list-item-content>
                  <v-list-item-subtitle>ID Jenis Hewan: {{ form.idJenis }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Nama Jenis Hewan: {{ form.namaJenis }}</v-list-item-subtitle>
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
      <v-btn dark text @click="snackbar=false">Close</v-btn>
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
        text: "ID Jenis",
        value: "idJenis"
      },
      {
        text: "Nama Jenis Hewan",
        value: "namaJenis"
      },
      {
        text: "Created By",
        value: "idPegawaiLog"
      },
      {
        text: "Action",
        value: null,
        sortable: false
      }
    ],
    jenises: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      namaJenis: "",
      idPegawaiLog: "Owner"
    },
    jenis: new FormData(),
    typeInput: "new",
    errors: "",
    status: 1,
    judul: "Data Jenis Hewan",
    btnLog: "Tampil Log Hapus",
    btnDialog: "Save",
    dialogSoftDelete: false,
    idPegawaiLog:"",
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "jenisHewan";
      this.$http.get(uri, this.jenis).then(response => {
        this.jenises = response.data.jenis;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "jenisHewan/softDelete";
      this.$http.get(uri, this.jenis).then(response => {
        this.jenises = response.data.jenis;
      });
    },

    sendData() {
      this.jenis.append("namaJenis", this.form.namaJenis);
      this.jenis.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "jenisHewan";
      this.load = true;
      this.$http
        .post(uri, this.jenis)
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
        this.idJenis = item.idJenis;
        this.form.namaJenis = item.namaJenis;
      } else {
        this.dialogSoftDelete = true;
        this.idJenis = item.idJenis;
        this.form.idJenis = item.idJenis;
        this.form.namaJenis = item.namaJenis;
      }
    },

    updateData() {
      this.jenis.append("namaJenis", this.form.namaJenis);
      this.jenis.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `jenisHewan/${this.idJenis}`;
      this.load = true;
      this.$http
        .post(uri, this.jenis)
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

    deleteData(idJenis) {
      var uri;
      this.jenis.append("idPegawaiLog", this.idPegawaiLog);
      if (this.status == 1) {
        uri = this.$apiUrl + "jenisHewan/" + idJenis; //data dihapus berdasarkan id
        this.$http
        .post(uri, this.jenis)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.deleteDialog = false;
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
        uri = this.$apiUrl + "jenisHewan/" + idJenis + "/permanen";
        this.$http
        .delete(uri)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.deleteDialog = false;
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
      }
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else if (this.status == 0) {
        this.restore();
      } else {
        console.log("dddd");
        this.updateData();
      }
    },

    resetForm() {
      this.form = {
        namaJenis: "",
        idPegawaiLog: "Owner"
      };
    },

    deletedData() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Jenis Hewan";
        this.btnLog = "Tampil Log Hapus";
        this.btnDialog = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Jenis Hewan Yang Dihapus";
        this.btnLog = "Tampil Jenis Hewan";
        this.btnDialog = "Restore";
      }
    },

    restore() {
      this.jenis.append("namaJenis", this.form.namaJenis);
      this.jenis.append("idPegawaiLog", "Owner");

      var uri = this.$apiUrl + `jenisHewan/${this.idJenis}/restore`;

      this.load = true;
      this.$http
        .post(uri, this.jenis)
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
    this.idPegawaiLog = this.$session.get('NIP');
  }
};
</script>