<template>
  <v-data-table :headers="headers" :items="customers" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Data Customer</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer />
        <v-flex xs5 class="text-right">
          <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        <v-spacer />
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn rounded @click="dialog=true" color="green accent-3">
          <v-icon size="18" class="mr-1">mdi-pencil-plus</v-icon>Tambah Customer
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
                    label="Nama Customer*"
                    v-model="form.namaCustomer"
                    required
                  ></v-text-field>
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
                    prepend-icon="mdi-cellphone"
                    label="Nomor Handphone*"
                    v-model="form.noHp"
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
      <v-icon color="error" @click="deleteData(item.idCustomer)">mdi-delete</v-icon>
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
        text: "ID Customer",
        value: "idCustomer"
      },
      {
        text: "Nama Customer",
        value: "namaCustomer"
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
        text: "Ditambahkan Oleh",
        value: "idPegawaiLog"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    customers: [],
    form: {
      namaCustomer: "",
      alamat: "",
      tglLahir: "",
      noHp: "",
      idPegawaiLog: "Owner"
    },
    customer: new FormData(),
    typeInput: "new"
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "customer";
      this.$http.get(uri, this.customer).then(response => {
        this.customers = response.data.customer;
      });
    },

    sendData() {
      this.customer.append("namaCustomer", this.form.namaCustomer);
      this.customer.append("alamat", this.form.alamat);
      this.customer.append("tglLahir", this.form.tglLahir);
      this.customer.append("noHp", this.form.noHp);
      this.customer.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "customer";
      this.load = true;
      this.$http.post(uri, this.customer).then(this.getData(), this.resetForm(), this.load = false);
    },

    updateData() {
      this.customer.append("namaCustomer", this.form.namaCustomer);
      this.customer.append("alamat", this.form.alamat);
      this.customer.append("tglLahir", this.form.tglLahir);
      this.customer.append("noHp", this.form.noHp);
      this.customer.append("idPegawaiLog", this.form.idPegawaiLog);

      var uri = this.$apiUrl + "customer/" + this.idCustomer;
      this.load = true;
      this.$http.post(uri, this.customer).then(this.getData(), this.resetForm(), this.load = false);
    },

    deleteData(idCustomer) {
      var uri = this.$apiUrl + "customer/" + idCustomer; //data dihapus berdasarkan id
      this.$http.delete(uri, this.customers).then(this.getData(), this.resetForm(), this.load = false,);
    },

    editHandler(item) {
      this.typeInput = "edit";
      this.dialog = true;
      this.idCustomer = item.idCustomer;
      this.form.namaCustomer = item.namaCustomer;
      this.form.alamat = item.alamat;
      this.form.tglLahir = item.tglLahir;
      this.form.noHp = item.noHp;
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
        namaCustomer: "",
        alamat: "",
        tglLahir: "",
        noHp: "",
        idPegawaiLog: "Owner"
      };
    }
  },

  mounted() {
    this.getData();
  }
};
</script>