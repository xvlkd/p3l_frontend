<template>
  <v-container>
    <v-card width="100%">
      <v-container grid-list-md mb-0>
        <h2 class="text-md-center">Log Hapus Ukuran Hewan</h2>
        <v-layout row wrap align-end style="margin:10px">
          <v-flex xs6 offset-xs9 align-end>
            <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
          </v-flex>
        </v-layout>

        <v-data-table :headers="headers" :items="ukurans" :search="keyword" :loading="load">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.idUkuran">
                <td>{{ item.idUkuran }}</td>
                <td>{{ item.namaUkuran }}</td>
                <td>{{ item.idPegawaiLog }}</td>
                <td>
                  <v-btn icon color="indigo" light @click="editHandler(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="error" light @click="deleteData(item.idUkuran)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

    <v-dialog v-model="dialog" presistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <!-- <v-card-text
                  prepend-icon="mdi-rename-box"
                  label="Ukuran Hewan*"
                  v-model="form.namaUkuran"
                ></v-card-text>-->
                <v-list-item-content>
                  <v-list-item-subtitle>ID Ukuran Hewan: {{ form.idUkuran }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Ukuran Hewan: {{ form.namaUkuran }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Dibuat Oleh: {{ form.idPegawaiLog }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="setForm()">Restore</v-btn>
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
        value: null,
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
    errors: ""
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "ukuranHewan/softDelete";
      this.$http.get(uri, this.ukuran).then(response => {
        this.ukurans = response.data.data;
      });
    },

    editHandler(item) {
      this.dialog = true;
      this.idUkuran = item.idUkuran;
      this.form.idUkuran = item.idUkuran;
      this.form.namaUkuran = item.namaUkuran;
    },

    restoreData() {
      this.ukuran.append("namaUkuran", this.form.namaUkuran);
      this.ukuran.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + `ukuranHewan/${this.idUkuran}/restore`;
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
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
          this.load = false;
          this.dialog = false;
        });
    },

    deleteData(idUkuran) {
      var uri = this.$apiUrl + "ukuranHewan/" + idUkuran + "/permanen"; //data dihapus berdasarkan id
      this.$http
        .delete(uri)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.dialog = false;
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
      this.restoreData();
    },

    resetForm() {
      this.form = {
        namaUkuran: "",
        idPegawaiLog: "Owner"
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>