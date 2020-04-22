<template>
  <v-data-table :headers="headers" :items="produks" :search="keyword" :loading="load">
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
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Produk
        </v-btn>

        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="green accent-3"
          @click="deletedProduct()"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>
          {{namaBtn}}
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
                    label="Nama Produk*"
                    v-model="form.namaProduk"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-cash-usd"
                    label="Harga Produk*"
                    type="number"
                    v-model="form.harga"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-earth-box"
                    label="Stok*"
                    type="number"
                    v-model="form.stok"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-earth-box"
                    label="Jumlah Minimal*"
                    type="number"
                    v-model="form.jumlahMinimal"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-file-input
                    label="Gambar Produk"
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
            <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="setForm()">{{btn}}</v-btn>
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
                    <v-img
                      :src="$apiUrl + 'produk/' + form.idProduk + '/gambar'"
                      width="80"
                      height="200"
                    ></v-img>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>ID Produk: {{ form.idProduk }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Nama Produk: {{ form.namaProduk }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Harga Produk: {{ form.harga }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Stok Produk: {{ form.stok }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Jumlah Minimal Produk: {{ form.jumlahMinimal }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="restore()">{{btn}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
        {{ text }}
        <v-btn dark text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </template>
    <template v-slot:item.gambar="{ item }">
      <v-img :src="$apiUrl + 'produk/' + item.idProduk + '/gambar'" width="80" height="80"></v-img>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.idProduk)">mdi-delete</v-icon>
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
        text: "ID Produk",
        value: "idProduk"
      },
      {
        text: "Nama Produk",
        value: "namaProduk"
      },
      {
        text: "Gambar Produk",
        value: "gambar"
      },
      {
        text: "Harga",
        value: "harga"
      },
      {
        text: "Stok Tersedia",
        value: "stok"
      },
      {
        text: "Jumlah Minimal",
        value: "jumlahMinimal"
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
    produks: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      namaProduk: "",
      harga: "",
      stok: "",
      jumlahMinimal: "",
      gambar: "",
      idPegawaiLog: "Owner"
    },
    produk: new FormData(),
    typeInput: "new",
    errors: "",
    status: 1,
    judul: "Data Produk",
    namaBtn: "Tampil Log Hapus",
    btn: "Save",
    dialogSoftDelete: false,
    konfirmasi: false,
    valid: true,
    imageUrl: null,
    idPegawaiLog: ""
  }),
  methods: {
    getData() {
      if (status == 0) {
        var uri = this.$apiUrl + "produk";
        this.$http.get(uri, this.produk).then(response => {
          this.produks = response.data.produk;
        });
      }
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "produk/softDelete";
      this.$http.get(uri, this.produk).then(response => {
        this.produks = response.data.produk;
      });
    },

    sendData() {
      this.produk.append("namaProduk", this.form.namaProduk);
      this.produk.append("harga", this.form.harga);
      this.produk.append("stok", this.form.stok);
      this.produk.append("jumlahMinimal", this.form.jumlahMinimal);
      this.produk.append("gambar", this.form.gambar);
      this.produk.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "produk";
      this.load = true;
      this.$http
        .post(uri, this.produk)
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
        this.idProduk = item.idProduk;
        this.form.namaProduk = item.namaProduk;
        this.form.harga = item.harga;
        this.form.stok = item.stok;
        this.form.jumlahMinimal = item.jumlahMinimal;
      } else {
        this.dialogSoftDelete = true;
        this.idProduk = item.idProduk;
        this.form.idProduk = item.idProduk;
        this.form.namaProduk = item.namaProduk;
        this.form.harga = item.harga;
        this.form.stok = item.stok;
        this.form.jumlahMinimal = item.jumlahMinimal;
      }
    },

    updateData() {
      this.produk.append("namaProduk", this.form.namaProduk);
      this.produk.append("harga", this.form.harga);
      this.produk.append("stok", this.form.stok);
      this.produk.append("jumlahMinimal", this.form.jumlahMinimal);
      this.produk.append("gambar", this.form.gambar);
      this.produk.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + `produk/update/${this.idProduk}`;
      this.load = true;
      this.$http
        .post(uri, this.produk)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan ke snackbar
          this.load = false;
          this.dialog = false;
          if (this.status == 1) {
            this.getData();
          } else {
            this.getDataSoftDelete();
          }
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

    deleteData(idProduk) {
      var uri;
      this.produk.append("idPegawaiLog", this.idPegawaiLog);
      if (this.status == 1) {
        if (confirm("Apakah Anda ingin menghapus Produk ini?")) {
          uri = this.$apiUrl + "produk/" + idProduk;
          this.$http
            .post(uri, this.produk)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
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
          confirm("Apakah Anda ingin menghapus produk ini secara permanen?")
        ) {
          uri = this.$apiUrl + "produk/" + idProduk + "/permanen"; //data dihapus berdasarkan id
          this.$http
            .delete(uri)
            .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
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
      } else if (this.status == 0) {
        this.restore();
      } else {
        this.updateData();
      }
    },

    resetForm() {
      this.form = {
        namaProduk: "",
        harga: "",
        stok: "",
        jumlahMinimal: "",
        gambar: "",
        idPegawaiLog: "Owner"
      };
    },

    restore() {
      this.produk.append("namaProduk", this.form.namaProduk);
      this.produk.append("harga", this.form.harga);
      this.produk.append("stok", this.form.stok);
      this.produk.append("jumlahMinimal", this.form.jumlahMinimal);
      this.produk.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + `produk/${this.idProduk}/restore`;
      if (confirm("Apakah Anda ingin memulihkan produk ini?")) {
        this.load = true;
        this.$http
          .post(uri, this.produk)
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
        this.text = "Gagal memulihkan produk.";
        this.color = "red";
      }
    },

    deletedProduct() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Produk";
        this.namaBtn = "Tampil Log Hapus";
        this.btn = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Produk Yang Dihapus";
        this.namaBtn = "Tampil Produk";
        this.btn = "Restore";
      }
    }
  },

  mounted() {
    this.getData();
    this.idPegawaiLog = this.$session.get("NIP");
  }
};
</script>

          