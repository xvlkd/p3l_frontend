<template>
  <v-slot>
    <v-card>
      <v-container grid-list-sm>
        <h2 class="text-md-center">Data Pegawai</h2>
        <v-layout row wrap style="margin:10px">
          <v-flex xs6>
            <v-btn
              depressed
              dark
              rounded
              style="text-transform: none !important;"
              color="green accent-3"
              @click="dialog=true"
            >
              <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>Tambah Pegawai
            </v-btn>
          </v-flex>
          <v-flex xs6 class="text-right">
            <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
          </v-flex>
        </v-layout>

        <v-data-table :headers="headers" :items="pegawais" :search="keyword" :loading="load">
          <template v-slot:body="{ items }">
            <tbody>
              <tr v-for="(item) in items" :key="item.NIP">
                <td>{{ item.NIP }}</td>
                <td>{{ item.namaPegawai }}</td>
                <td>{{ item.jabatan }}</td>
                <td>{{ item.noHp }}</td>
                <td>{{ item.alamat }}</td>
                <td>{{ item.tglLahir }}</td>
                <td>
                  <v-btn icon color="indigo" light @click="editHandler(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon color="error" light @click="deleteData(item.NIP)">
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
                  label="Nama Pegawai*"
                  v-model="form.namaPegawai"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-account-group"
                  label="Jabatan*"
                  v-model="form.jabatan"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field prepend-icon="mdi-phone" label="No HP*" v-model="form.noHp" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  prepend-icon="mdi-map-marker"
                  label="Alamat*"
                  v-model="form.alamat"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu
                  v-model="menu2"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      prepend-icon="mdi-calendar"
                      label="Tanggal Lahir*"
                      v-model="form.tglLahir"
                      v-on="on"
                      required
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="form.tglLahir"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="setForm()">Tambah Pegawai</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
      {{ text }}
      <v-btn dark text @click="snackbar=false">Close</v-btn>
    </v-snackbar>
  </v-slot>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    menu2: false,
    items: [],
    keyword: "",
    headers: [
      {
        text: "NIP",
        value: "nip"
      },
      {
        text: "Nama Pegawai",
        value: "namaPegawai"
      },
      {
        text: "Jabatan",
        value: "jabatan"
      },
      {
        text: "Nomor HP",
        value: "noHp"
      },
      {
        text: "Alamat",
        value: "alamat"
      },
      {
        text: "Tanggal Lahir",
        value: "tglLahir"
      },
      {
        text: "Action",
        value: null,
        sortable: false
      }
    ],
    pegawais: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      namaPegawai: "",
      jabatan: "",
      noHp: "",
      alamat: "",
      tglLahir: ""
    },
    pegawai: new FormData(),
    typeInput: "new",
    errors: ""
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "pegawai";
      this.$http.get(uri, this.pegawais).then(response => {
        this.pegawais = response.data.data;
      });
    },

    sendData() {
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);

      var uri = this.$apiUrl + "pegawai";
      this.load = true;
      this.$http
        .post(uri, this.pegawais)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan kesnackbar
          this.load = false;
          this.dialog = false;
          this.getData(); //mengambil data user
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

    deleteData(NIP) {
      //mengahapus data
      var uri = this.$apiUrl + "pegawai/" + NIP; //data dihapus berdasarkan id
      this.$http
        .delete(uri, this.pegawais)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.deleteDialog = false;
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
        console.log("dddd");
        this.updateData();
      }
    },
    resetForm() {
      this.form = {
        namaPegawai: "",
        jabatan: "",
        noHp: "",
        alamat: "",
        tglLahir: ""
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>