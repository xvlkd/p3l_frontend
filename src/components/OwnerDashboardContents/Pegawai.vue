<template>
  <v-data-table :headers="headers" :items="pegawais" :search="keyword" :loading="load">
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
          <v-icon class="mr-1">mdi-pencil-plus</v-icon>Tambah Pegawai
        </v-btn>
        <v-btn
              depressed
              dark
              rounded
              style="text-transform: none !important;"
              color="blue accent-3"
              @click="deletedPegawai()"
            >
              <v-icon class="mr-2">mdi-delete</v-icon>
              {{namaBtn}}
            </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" persistent max-width="600">
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
                      :items="['Customer Service', 'Kasir']"
                      label="Jabatan*"
                      v-model="form.jabatan"
                      aria-required=""
                      v-if="typeInput =='new'" 
                    ></v-select>

                    <v-select
                      prepend-icon="mdi-account"
                      :items="['Owner', 'Customer Service', 'Kasir']"
                      label="Jabatan*"
                      v-model="form.jabatan"
                      v-if="typeInput =='edit' " disabled
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
                  <v-text-field
                    prepend-icon="mdi-map-marker"
                    label="Kata Sandi*"
                    type="password"
                    v-model="form.kataSandi"
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

      <v-dialog v-model="dialogSoftDelete" persistent max-width="400">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-list-item-content>
                  <v-img :src="$apiUrl + 'pegawai/' + form.NIP + '/gambar'" width="80" height="200"></v-img>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>NIP: {{ form.NIP }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Nama Pegawai: {{ form.namaPegawai }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Alamat: {{ form.alamat }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Tanggal Lahir: {{ form.tglLahir }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>No Handphone: {{ form.noHp }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Jabatan: {{ form.jabatan }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
          <v-btn color="blue darken-1" text @click="restoreData()">{{btn}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert
      v-model="alert"
      dismissible
      color="cyan"
      border="left"
      elevation="2"
      colored-border
    >
      Data <strong>Owner</strong> tidak dapat dihapus.
    </v-alert>
    </template>
    <template v-slot:item.gambar="{ item }">
            <v-img :src="$apiUrl + 'pegawai/' + item.NIP + '/gambar'" width="80" height="80"></v-img>
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
    alert:false,
    dialog: false,
    items: [],
    keyword: "",
    idPegawaiLog:"",
    status: 1,
    judul: "Data Pegawai",
    namaBtn: "Tampil Log Hapus",
    btn: "Save",
    dialogSoftDelete: false,
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
        text: "Foto Pegawai",
        value: "gambar"
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
      kataSandi:"",
      idPegawaiLog: "Owner"
    },
    pegawai: new FormData(),
    typeInput: "new",
    nip:"",
    load:false,
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "pegawai";
      this.$http.get(uri, this.pegawai).then(response => {
        this.pegawais = response.data.pegawai;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "pegawai/softDelete";
      this.$http.get(uri, this.pegawai).then(response => {
        this.pegawais = response.data.pegawai;
      });
    },

    sendData() {
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("kataSandi", this.form.kataSandi);
      this.pegawai.append("gambar", this.form.gambar);
      this.pegawai.append("idPegawaiLog", this.idPegawaiLog);
      var uri = this.$apiUrl + "pegawai";
      this.load = true;
      this.$http
        .post(uri, this.pegawai)
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
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("kataSandi", this.form.kataSandi);
      this.pegawai.append("gambar", this.form.gambar);
      this.pegawai.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `pegawai/update/${this.nip}`;
      this.load = true;
      this.$http.post(uri, this.pegawai)
      .then(response => {
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.load=false;
        })
        .catch(error => {
          this.errors = error;
          this.load=false;
          this.snackbar = true;
          this.text = error;
          this.color = "red";
        });
        this.getData();
    },

    deleteData(NIP){ 
      if(NIP == "Owner")
      {
        this.alert = true;
      }
      else
      {
        var uri;

        if (this.status == 1) {
          this.pegawai.append("idPegawaiLog", this.idPegawaiLog);
          if(confirm('Apakah Anda ingin menghapus Pegawai ini?'))
          {
            this.load=true;
            uri = this.$apiUrl + `pegawai/${NIP}` ;
            this.$http.post(uri, this.pegawai)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
              this.getData();
              this.load = false;
            })
            .catch(error => {
              this.errors = error;
              this.snackbar = true;
              this.text = "Try Again";
              this.color = "red";
              this.load = false;
            });
          }
          else
          {
            this.snackbar = true;
            this.text = "Data Pegawai gagal dihapus.";
            this.color = "red";
          }
        } 
        else 
        {
          uri = this.$apiUrl + "pegawai/" + NIP + "/permanen"; //data dihapus berdasarkan id
          if(confirm('Apakah Anda ingin menghapus Pegawai ini secara permanen?'))
          {
            this.load = true;
            this.$http.delete(uri)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
              this.getDataSoftDelete();
              this.load = false;
            })
            .catch(error => {
              this.errors = error;
              this.snackbar = true;
              this.text = "Try Again";
              this.color = "red";
              this.load = false;
            });
          }
          else
          {
            this.snackbar = true;
            this.text = "Data Pegawai gagal dihapus permanen.";
            this.color = "red";
          }
        }
      }
    },

    restoreData() {
      this.pegawai.append("namaPegawai", this.form.namaPegawai);
      this.pegawai.append("alamat", this.form.alamat);
      this.pegawai.append("tglLahir", this.form.tglLahir);
      this.pegawai.append("noHp", this.form.noHp);
      this.pegawai.append("jabatan", this.form.jabatan);
      this.pegawai.append("gambar", this.form.gambar);
      this.pegawai.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `pegawai/${this.nip}/restore`;
      if(confirm('Apakah Anda ingin memulihkan Layanan ini?'))
      {
        this.load = true;
        this.$http
        .post(uri, this.pegawai)
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
      }
      else
      {
        this.snackbar = true;
        this.text = "Memulihkan data Pegawail gagal.";
        this.color = "red";
      }
    },

    editHandler(item) {
      if (this.status == 1) {
        this.typeInput = "edit";
        this.dialog = true;
        this.nip = item.NIP;
        this.form.namaPegawai = item.namaPegawai;
        this.form.alamat = item.alamat;
        this.form.tglLahir = item.tglLahir;
        this.form.noHp = item.noHp;
        this.form.jabatan = item.jabatan;
        this.form.gambar = item.gambar;
      } else {
        this.dialogSoftDelete = true;
        this.nip = item.NIP;
        this.form.NIP = item.NIP;
        this.form.namaPegawai = item.namaPegawai;
        this.form.alamat = item.alamat;
        this.form.tglLahir = item.tglLahir;
        this.form.noHp = item.noHp;
        this.form.jabatan = item.jabatan;
        this.form.gambar = item.gambar;
      }
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
        this.dialog = false;
      }
      else {
        this.updateData();
        this.dialog = false;
        this.typeInput === "new"
      }
    },

    resetForm() {
      this.typeInput ='new'
      this.form = {
        namaPegawai: "",
        alamat: "",
        tglLahir: "",
        noHp: "",
        jabatan: "",
        gambar: "",
        idPegawaiLog: "Owner"
      };
    },

    deletedPegawai() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Pegawai";
        this.namaBtn = "Tampil Log Hapus";
        this.btn = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Daftar Pegawai Yang Dihapus";
        this.namaBtn = "Tampil Pegawai";
        this.btn = "Restore";
      }
    }
  },

  mounted() {
    this.getData();
    this.idPegawaiLog = this.$session.get('NIP');
  }
};
</script>