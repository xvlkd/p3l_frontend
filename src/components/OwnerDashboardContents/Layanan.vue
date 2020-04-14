<template>
  <v-data-table :headers="headers" :items="layanans" :search="keyword">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Data Layanan</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn rounded @click="dialog=true" color="green accent-3">
          <v-icon size="18" class="mr-1">mdi-pencil-plus</v-icon>Tambah Layanan
        </v-btn>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn rounded @click="getDataSoftDelete()" color="red accent-3">
          <v-icon size="18" class="mr-1">mdi-delete</v-icon>Tampil Log Hapus
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" persistent max-width="400">
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
                  <v-text-field
                    prepend-icon="mdi-format-size"
                    label="ID Ukuran*"
                    v-model="form.idUkuran"
                    required
                  ></v-text-field>
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
      <v-icon color="error" @click="deleteData(item.idLayanan)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    dialogSoftDelete: false,
    items: [],
    keyword: "",
    headers: [
      { text: "Nama layanan", value: "namaLayanan" },
      { text: "Harga", value: "harga" },
      { text: "ID Ukuran", value: "idUkuran" },
      { text: "Ditambahkan Oleh", value: "idPegawaiLog" },
      { text: "Action", value: "actions", sortable: false }
    ],
    layanans: [],
    form: {
      namaLayanan: "",
      harga: "",
      idUkuran: "",
      idPegawaiLog: "Owner"
    },
    layanan: new FormData(),
    typeInput: "new"
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "layanan";
      this.$http.get(uri, this.layanan).then(response => {
        this.layanans = response.data.data;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "layanan/softDelete";
      this.$http.get(uri, this.layanan).then(response => {
        this.layanans = response.data.data;
      });
    },

    sendData() {
      this.layanan.append("namaLayanan", this.form.namaLayanan);
      this.layanan.append("harga", this.form.harga);
      this.layanan.append("idUkuran", this.form.idUkuran);
      this.layanan.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "layanan";
      this.$http
        .post(uri, this.layanan)
        .then(this.getData(), this.resetForm());
    },

    updateData() {
      this.layanan.append("namaLayanan", this.form.namaLayanan);
      this.layanan.append("harga", this.form.harga);
      this.layanan.append("idUkuran", this.form.idUkuran);
      this.layanan.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "layanan/" + this.idLayanan;
      this.$http
        .post(uri, this.layanan)
        .then(this.getData(), this.resetForm());
    },

    deleteData(idLayanan) {
      var uri = this.$apiUrl + "layanan/" + idLayanan; //data dihapus berdasarkan id
      this.$http
        .delete(uri, this.layanan)
        .then(this.getData(), this.resetForm());
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.idLayanan = item.idLayanan;
      this.form.namaLayanan = item.namaLayanan;
      this.form.harga = item.harga;
      this.form.idUkuran = item.idUkuran;
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
        this.dialog = false;
        this.resetForm();
      } else {
        this.updateData();
        this.dialog = false;
        this.resetForm();
      }
    },

    resetForm() {
      this.form = {
        namaLayanan: "",
        harga: "",
        idUkuran: "",
        idPegawaiLog: "Owner"
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>