<template>
  <v-container>
    <v-card width="100%">
      <v-container grid-list-md mb-0>
        <h2 class="text-md-center">Log Hapus Produk</h2>
        <v-layout row wrap align-end style="margin:10px">
          <v-flex xs6 offset-xs9 align-end>
            <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
          </v-flex>
        </v-layout>

        <v-data-table :headers="headers" :items="produks" :search="keyword" :loading="load">
          <template v-slot:item.gambar="{ item }">
            <v-img :src="$apiUrl + 'produk/' + item.idProduk + '/gambar'" width="80" height="80"></v-img>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
            <v-icon color="error" @click="deleteData(item.idProduk)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-container>
    </v-card>

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
    errors: ""
  }),
  methods: {
    getData() {
      var uri = this.$apiUrl + "produk/softDelete";
      this.$http.get(uri, this.produk).then(response => {
        this.produks = response.data.data;
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

    onFileSelected(event) {
      console.log(event);
      this.form.gambar = event.target.files[0];
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.idProduk = item.idProduk;
      this.form.namaProduk = item.namaProduk;
      this.form.harga = item.harga;
      this.form.stok = item.stok;
      this.form.jumlahMinimal = item.jumlahMinimal;
      this.form.gambar = this.onFileSelected;
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

    deleteData(idProduk) {
      var uri = this.$apiUrl + "produk/" + idProduk; //data dihapus berdasarkan id
      this.$http
        .delete(uri)
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
        namaProduk: "",
        harga: "",
        stok: "",
        jumlahMinimal: "",
        gambar: "",
        idPegawaiLog: "Owner"
      };
    },

    deletedProduct() {
      this.$router.push({ name: "Deleted Produk" });
    }
  },

  mounted() {
    this.getData();
  }
};
</script>