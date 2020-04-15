<template>
  <v-data-table :headers="headers" :items="customers" :search="keyword" :loading="load">
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
          <v-icon class="mr-1">mdi-pencil-plus</v-icon>Tambah Customer
        </v-btn>
        <v-btn
              depressed
              dark
              rounded
              style="text-transform: none !important;"
              color="blue accent-3"
              @click="deletedCustomer()"
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
                    label="Nama Customer*"
                    v-model="form.namaCustomer"
                    required
                  ></v-text-field>
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
                  <v-img :src="$apiUrl + 'customer/' + form.idCustomer + '/gambar'" width="80" height="200"></v-img>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>idCustomer: {{ form.idCustomer }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle>Nama Customer: {{ form.namaCustomer }}</v-list-item-subtitle>
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
    idPegawaiLog:"",
    status: 1,
    judul: "Data Customer",
    namaBtn: "Tampil Log Hapus",
    btn: "Save",
    dialogSoftDelete: false,
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
      jabatan: "",
      idPegawaiLog: "Owner"
    },
    customer: new FormData(),
    typeInput: "new",
    nip:"",
    load:false,
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "customer";
      this.$http.get(uri, this.customer).then(response => {
        this.customers = response.data.customer;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "customer/softDelete";
      this.$http.get(uri, this.customer).then(response => {
        this.customers = response.data.customer;
      });
    },

    sendData() {
      this.customer.append("namaCustomer", this.form.namaCustomer);
      this.customer.append("alamat", this.form.alamat);
      this.customer.append("tglLahir", this.form.tglLahir);
      this.customer.append("noHp", this.form.noHp);
      this.customer.append("idPegawaiLog", this.idPegawaiLog);
      var uri = this.$apiUrl + "customer";
      this.load = true;
      this.$http
        .post(uri, this.customer)
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
      this.customer.append("namaCustomer", this.form.namaCustomer);
      this.customer.append("alamat", this.form.alamat);
      this.customer.append("tglLahir", this.form.tglLahir);
      this.customer.append("noHp", this.form.noHp);
      this.customer.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `customer/update/${this.nip}`;
      this.load = true;
      this.$http.post(uri, this.customer)
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

    deleteData(idCustomer){ 
        var uri;

        if (this.status == 1) {
          this.customer.append("idPegawaiLog", this.idPegawaiLog);
          if(confirm('Apakah Anda ingin menghapus Customer ini?'))
          {
            this.load=true;
            uri = this.$apiUrl + `customer/${idCustomer}` ;
            this.$http.post(uri, this.customer)
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
            this.text = "Data Customer gagal dihapus.";
            this.color = "red";
          }
        } 
        else 
        {
          uri = this.$apiUrl + "customer/" + idCustomer + "/permanen"; //data dihapus berdasarkan id
          if(confirm('Apakah Anda ingin menghapus Customer ini secara permanen?'))
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
            this.text = "Data Customer gagal dihapus permanen.";
            this.color = "red";
          }
        }
    },

    restoreData() {
      this.customer.append("namaCustomer", this.form.namaCustomer);
      this.customer.append("alamat", this.form.alamat);
      this.customer.append("tglLahir", this.form.tglLahir);
      this.customer.append("noHp", this.form.noHp);
      this.customer.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `customer/${this.nip}/restore`;
      if(confirm('Apakah Anda ingin memulihkan Layanan ini?'))
      {
        this.load = true;
        this.$http
        .post(uri, this.customer)
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
        this.text = "Memulihkan data Customer gagal.";
        this.color = "red";
      }
    },

    editHandler(item) {
      if (this.status == 1) {
        this.typeInput = "edit";
        this.dialog = true;
        this.nip = item.idCustomer;
        this.form.namaCustomer = item.namaCustomer;
        this.form.alamat = item.alamat;
        this.form.tglLahir = item.tglLahir;
        this.form.noHp = item.noHp;
      } else {
        this.dialogSoftDelete = true;
        this.nip = item.idCustomer;
        this.form.idCustomer = item.idCustomer;
        this.form.namaCustomer = item.namaCustomer;
        this.form.alamat = item.alamat;
        this.form.tglLahir = item.tglLahir;
        this.form.noHp = item.noHp;
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
        namaCustomer: "",
        alamat: "",
        tglLahir: "",
        noHp: "",
        idPegawaiLog: "Owner"
      };
    },

    deletedCustomer() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Customer";
        this.namaBtn = "Tampil Log Hapus";
        this.btn = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Daftar Customer Yang Dihapus";
        this.namaBtn = "Tampil Customer";
        this.btn = "Restore";
      }
    }
  },

  mounted() {
    this.getData();
    this.idPegawaiLog = this.$session.get('idCustomer');
  }
};
</script>