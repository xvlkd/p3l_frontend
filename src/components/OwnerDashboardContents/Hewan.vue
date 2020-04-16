<template>
  <v-data-table :headers="headers" :items="hewans" :search="keyword" :loading="load">
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
          <v-icon class="mr-2">mdi-pencil-plus</v-icon>Tambah Hewan
        </v-btn>
        <v-btn
          depressed
          dark
          rounded
          style="text-transform: none !important;"
          color="blue accent-3"
          @click="setHewan()"
        >
          <v-icon class="mr-2">mdi-delete</v-icon>
          {{btnLog}}
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
                    label="Nama Hewan*"
                    v-model="form.namaHewan"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    prepend-icon="mdi-calendar"
                    label="Tanggal Lahir*"
                    v-model="form.tglLahir"
                    type="date"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="jeniss"
                    item-text="namaJenis"
                    item-value="idJenis"
                    label="Jenis Hewan"
                    prepend-icon="mdi-dog"
                    dense
                    v-model="form.idJenis"
                    required
                  ></v-select>
                </v-col>

                <v-col cols="12">
                  <v-select
                    :items="customers"
                    item-text="namaCustomer"
                    item-value="idCustomer"
                    label="Nama Pemilik"
                    prepend-icon="mdi-account"
                    dense
                    v-model="form.idCustomer"
                    required
                  ></v-select>
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
                    <v-list-item-subtitle>ID Hewan: {{ form.idHewan }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Nama Hewan: {{ form.namaHewan }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Tanggal Lahir: {{ form.tglLahir }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Jenis Hewan: {{ form.namaJenis }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-subtitle>Nama Pemilik: {{ form.namaCustomer }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red darken-1" text @click="dialogSoftDelete=false, resetForm()">Close</v-btn>
            <v-btn color="blue darken-1" text @click="restoreData()">{{btnDialog}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" class="mr-2" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.idHewan)">mdi-delete</v-icon>
    </template>-->
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    dialog: false,
    items: [],
    keyword: "",
    headers: [
      { text: "ID Hewan", value: "idHewan" },
      { text: "Nama Hewan", value: "namaHewan" },
      { text: "Tanggal Lahir", value: "tglLahir" },
      { text: "Jenis Hewan", value: "namaJenis" },
      { text: "Nama Pemilik", value: "namaCustomer" },
      { text: "Ditambahkan Oleh", value: "idPegawaiLog" },
      { text: "Action", value: "actions", sortable: false }
    ],
    load:false,
    hewans: [],
    jeniss:[],
    customers: [],
    idPegawaiLog:"",
    form: {
      idHewan:"",
      namaHewan: "",
      tglLahir: "",
      idJenis: "",
      namaJenis:"",
      idCustomer: "",
      namaCustomer: "",
      idPegawaiLog: "Owner"
    },
    hewan: new FormData(),
    typeInput: "new",
    status: 1,
    judul: "Data Hewan",
    btnLog: "Tampil Log Hapus",
    btnDialog: "Save",
    dialogSoftDelete: false,
  }),

  methods: {
    getData() {
      var uri = this.$apiUrl + "hewan";
      this.$http.get(uri, this.hewan).then(response => {
        this.hewans = response.data.hewan;
      });
    },

    getDataSoftDelete() {
      var uri = this.$apiUrl + "hewan/softDelete";
      this.$http.get(uri, this.hewan).then(response => {
        this.hewans = response.data.hewan;
      });
    },

    getJenis() {
      var uri = this.$apiUrl + "jenisHewan";
      this.$http.get(uri, this.jenis).then(response => {
        this.jeniss = response.data.jenis;
        this.form.idJenis = response.data.jenis[0].idJenis;
      });
    },

    getCustomer() {
      var uri = this.$apiUrl + "customer";
      this.$http.get(uri, this.customer).then(response => {
        this.customers = response.data.customer;
        this.form.idCustomer = response.data.customer[0].idCustomer;
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
      this.load = true;
      this.$http
        .post(uri, this.hewan)
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
      this.hewan.append("namaHewan", this.form.namaHewan);
      this.hewan.append("tglLahir", this.form.tglLahir);
      this.hewan.append("idJenis", this.form.idJenis);
      this.hewan.append("idCustomer", this.form.idCustomer);
      this.hewan.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + "hewan/update/" + this.form.idHewan;
      this.load = true;
      this.$http
        .post(uri, this.hewan)
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

    deleteData(idHewan) {
       var uri;

      if (this.status == 1) {
        this.hewan.append("idPegawaiLog", this.idPegawaiLog);

        uri = this.$apiUrl + `hewan/${idHewan}` ;
        if(confirm('Apakah Anda ingin Menghapus Hewan ini?'))
        {
          this.load= true;
          this.$http.post(uri, this.hewan)
          .then(response => {
            this.snackbar = true;
            this.text = response.data.message;
            this.color = "green";
            this.getData();
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
          });
          this.load= false;
        }
        else
        {
          this.snackbar = true;
          this.text = "Data Hewan gagal dihapus.";
          this.color = "red";
        }
        
      } 
      else 
      {
        uri = this.$apiUrl + "hewan/" + idHewan + "/permanen"; //data dihapus berdasarkan id
        if(confirm('Apakah Anda ingin Menghapus Hewan ini secara permanen?'))
        {
          this.load= true;
          this.$http.delete(uri)
          .then(response => {
              this.snackbar = true;
              this.text = response.data.message;
              this.color = "green";
              this.getDataSoftDelete();
            })
            .catch(error => {
              this.errors = error;
              this.snackbar = true;
              this.text = "Try Again";
              this.color = "red";
            });
            this.load= false;
        }
        else
        {
          this.snackbar = true;
          this.text = "Data Hewan gagal dihapus secara permanen.";
          this.color = "red";
        }
      }
    },

    restoreData() {
      this.hewan.append("namaHewan", this.form.namaHewan);
      this.hewan.append("tglLahir", this.form.tglLahir);
      this.hewan.append("idJenis", this.form.idJenis);
      this.hewan.append("idCustomer", this.form.idCustomer);
      this.hewan.append("idPegawaiLog", this.idPegawaiLog);

      var uri = this.$apiUrl + `hewan/${this.form.idHewan}/restore`;
      if(confirm('Apakah Anda ingin memulihkan Hewan ini?'))
      {
        this.load = true;
        this.$http
        .post(uri, this.hewan)
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
        this.text = "Memulihkan data Hewan gagal.";
        this.color = "red";
      }
    },

    editHandler(item) {
      if (this.status == 1) {
        this.typeInput = "edit";
        this.dialog = true;
        this.form.idHewan = item.idHewan;
        this.form.namaHewan = item.namaHewan;
        this.form.tglLahir = item.tglLahir;
        for (var i=0; i < this.jeniss.length; i++)
        {
          if(this.jeniss[i].idJenis == item.idJenis)
          {
            this.form.idJenis = this.jeniss[i].idJenis;
          }
        }
        for (var j=0; j < this.customers.length; j++)
        {
          if(this.customers[j].idCustomer == item.idCustomer)
          {
            this.form.idCustomer = this.customers[j].idCustomer;
          }
        }
      } else {
        this.dialogSoftDelete = true;
        this.form.idHewan = item.idHewan;
        this.form.namaHewan = item.namaHewan;
        this.form.namaJenis = item.namaJenis;
        this.form.tglLahir = item.tglLahir;
        for (var i=0; i < this.jeniss.length; i++)
        {
          if(this.jeniss[i].idJenis == item.idJenis)
          {
            this.form.namaJenis = this.jeniss[i].namaJenis;
          }
        }
        for (var j=0; j < this.customers.length; j++)
        {
          if(this.customers[j].idCustomer == item.idCustomer)
          {
            this.form.namaCustomer = this.customers[j].namaCustomer;
          }
        }
      }
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
        this.dialog = false;
      } else {
        this.updateData();
        this.dialog = false;
        this.typeInput === "new"
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
    },

    setHewan() {
      if (this.status == 0) {
        this.getData();
        this.status = 1;
        this.judul = "Data Hewan";
        this.btnLog = "Tampil Log Hapus";
        this.btnDialog = "Save";
      } else {
        this.getDataSoftDelete();
        this.status = 0;
        this.judul = "Data Hewan Yang Dihapus";
        this.btnLog = "Tampil Hewan";
        this.btnDialog = "Restore";
      }
    },
  },

  mounted() {
    this.getData();
    this.getJenis();
    this.getCustomer();
    this.idPegawaiLog = this.$session.get('NIP');
  }
};
</script>