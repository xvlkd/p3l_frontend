<template>
  <v-data-table :headers="headers" :items="pegawais" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Data Pegawai</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn rounded @click="dialog=true" color="green accent-3">
          <v-icon size="18" class="mr-1">mdi-pencil-plus</v-icon>Tambah Pegawai
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" presistent max-width="600">
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    prepend-icon="mdi-rename-box"
                    label="Nama Pegawai*"
                    v-model="form.namaPegawai"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                      prepend-icon="mdi-account"
                      :items="['Owner', 'Customer Service', 'Kasir']"
                      label="Jabatan*"
                      v-model="form.jabatan"
                      required
                    ></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    prepend-icon="mdi-map-marker"
                    label="Alamat*"
                    v-model="form.alamat"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    prepend-icon="mdi-calendar"
                    label="Tanggal Lahir*"
                    type="date"
                    v-model="form.tglLahir"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    prepend-icon="mdi-cellphone"
                    label="Nomor Handphone*"
                    v-model="form.noHp"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                <v-file-input
                  label="Gambar Pegawai"
                  accept="image/png, image/jpeg, image/bmp"
                  prepend-icon="mdi-camera"
                  v-model="form.gambar"
                  required
                ></v-file-input>
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
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.NIP)">mdi-delete</v-icon>
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
        text: "ID Pegawai",
        value: "NIP"
      },
      {
        text: "Nama Pegawai",
        value: "namaPegawai"
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
        text: "Nomor Handphone",
        value: "noHp"
      },
      {
        text: "Jabatan",
        value: "jabatan"
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
    pegawais: [],
    form: {
      namaPegawai: "",
      alamat: "",
      tglLahir: "",
      noHp: "",
      jabatan: "",
      gambar: "",
      idPegawaiLog: "Owner"
    },
    pegawai: new FormData(),
    typeInput: "new"
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "pegawai";
      this.$http.get(uri, this.pegawai).then(response => {
        this.pegawais = response.data.data;
      });
    },

    sendData() {
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("gambar", this.form.gambar);
      this.pegawai.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "pegawai";
      this.load = true;
      this.$http.post(uri, this.pegawai).then(this.getData(), this.resetForm(), this.load = false);
    },

    updateData() {
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("gambar", this.form.gambar);
      this.pegawai.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "pegawai/" + this.NIP;
      this.load = true;
      this.$http.post(uri, this.pegawai).then(this.getData(), this.resetForm(), this.load = false);
    },

    deleteData(NIP) {
      var uri = this.$apiUrl + "pegawai/" + NIP; //data dihapus berdasarkan id
      this.$http.delete(uri, this.pegawais).then(this.getData(), this.resetForm(), this.load = false,);
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.NIP = item.NIP;
      this.form.namaPegawai = item.namaPegawai;
      this.form.alamat = item.alamat;
      this.form.tglLahir = item.tglLahir;
      this.form.noHp = item.noHp;
      this.form.jabatan = item.jabatan;
      this.form.gambar = item.gambar;
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
        this.dialog = false;
      } else {
        this.updateData();
        this.dialog = false;
      }
    },

    resetForm() {
      this.form = {
        namaPegawai: "",
        alamat: "",
        tglLahir: "",
        noHp: "",
        jabatan: "",
        gambar: "",
        idPegawaiLog: "Owner"
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>