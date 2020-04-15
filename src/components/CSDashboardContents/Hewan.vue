<template>
  <v-data-table :headers="headers" :items="hewans" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Data Hewan</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn rounded @click="dialog=true" color="green accent-3">
          <v-icon size="18" class="mr-1">mdi-pencil-plus</v-icon>Tambah Hewan
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
                    label="Nama hewan*"
                    v-model="form.namaHewan"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-calendar"
                    label="Tanggal Lahir*"
                    type="date"
                    v-model="form.tglLahir"
                    required
                  ></v-text-field>
                </v-col>
                
                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-cat"
                    label="ID Jenis*"
                    v-model="form.idJenis"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-account-box-multiple"
                    label="ID Ukuran*"
                    v-model="form.idCustomer"
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
      <v-icon color="error" @click="deleteData(item.idHewan)">mdi-delete</v-icon>
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
        text: "ID hewan",
        value: "idHewan"
      },
      {
        text: "Nama hewan",
        value: "namaHewan"
      },
      {
        text: "Tanggal Lahir",
        value: "tglLahir"
      },
      {
        text: "Jenis Hewan",
        value: "namaJenis"
      },
      {
        text: "Nama Pemilik",
        value: "namaCustomer"
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
    hewans: [],
    form: {
      namaHewan: "",
      tglLahir: "",
      idJenis: "",
      idCustomer: "",
      idPegawaiLog: "Owner"
    },
    hewan: new FormData(),
    typeInput: "new"
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "hewan";
      this.$http.get(uri, this.hewan).then(response => {
        this.hewans = response.data.hewan;
      });
    },

    sendData() {
      this.hewan.append("namaHewan", this.form.namaHewan);
      this.hewan.append("tglLahir", this.form.tglLahir);
      this.hewan.append("idJenis", this.form.idJenis);
      this.hewan.append("idCustomer", this.form.idCustomer);
      this.hewan.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "hewan";
      this.load = true;
      this.$http.post(uri, this.hewan).then(this.getData(), this.resetForm(), this.load = false,);
    },

    updateData() {
      this.hewan.append("namaHewan", this.form.namaHewan);
      this.hewan.append("tglLahir", this.form.tglLahir);
      this.hewan.append("idJenis", this.form.idJenis);
      this.hewan.append("idCustomer", this.form.idCustomer);
      this.hewan.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "hewan/" + this.idHewan;
      this.load = true;
      this.$http.post(uri, this.hewan).then(this.getData(), this.resetForm(), this.load = false,);
    },

    deleteData(idHewan) {
      var uri = this.$apiUrl + "hewan/" + idHewan; //data dihapus berdasarkan id
      this.$http.delete(uri, this.hewans).then(this.getData(), this.resetForm(), this.load = false,);
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.idHewan = item.idHewan;
      this.form.namaHewan = item.namaHewan;
      this.form.tglLahir = item.tglLahir;
      this.form.idJenis = item.idJenis;
      this.form.idCustomer = item.idCustomer;
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
        namaHewan: "",
        tglLahir: "",
        idJenis: "",
        idCustomer: "",
        idPegawaiLog: "Owner"
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>