<template>
  <v-data-table :headers="headers" :items="transaksis" :search="keyword" :loading="load">
    <template v-slot:top>
      <v-toolbar>
        <v-toolbar-title>Transaksi Layanan</v-toolbar-title>
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
          @click="dialogTambah=true"
          class="mr-4"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Transaksi
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialogTambah" persistent max-width="800">
      <v-card>
        <v-toolbar>
          <v-flex xs6>
            <v-toolbar-title>Daftar Hewan dan Customer</v-toolbar-title>
          </v-flex>
          <v-flex xs6 class="text-right">
            <v-text-field v-model="search" append-icon="mdi-search" label="Search" hide-details></v-text-field>
        </v-flex>
        </v-toolbar>
      <v-card-text color="orange">
            <v-container>
              <v-row>
                <v-col cols="4" v-for="hewan in filteredList" :key="hewan.idHewan">
                  <v-card 
                    class="d-inline-flex" 
                    color="#424242" 
                    @click="sendData(hewan)"
                  >
                    <v-list-item three-line>
                      <v-list-item-content>
                       <v-card-title>{{hewan.namaHewan}}</v-card-title>
                        <v-divider class="mx-4"></v-divider>
                        <v-card-subtitle>{{hewan.namaCustomer}}<v-spacer></v-spacer>{{hewan.alamat}}</v-card-subtitle>


                      </v-list-item-content>
                    </v-list-item>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogTambah=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
        
     <v-dialog v-model="dialogDetail" persistent max-width="600">
      <v-card>
        <v-toolbar>
          <v-flex xs6>
            <v-toolbar-title>Detail Transaksi Layanan</v-toolbar-title>
          </v-flex>
          <v-flex xs6 class="text-right">
            <v-text-field v-model="search" append-icon="mdi-search" label="Search" hide-details></v-text-field>
            </v-flex>
        </v-toolbar>
      <v-card-text >
        <v-card-title>
            <v-flex xs6>
                <v-card-subtitle>Daftar Layanan Yang di Pesan : </v-card-subtitle>
            </v-flex>
            <v-flex xs6 class="text-right">
                <v-btn
                    v-if="statusLayanan==false"
                    depressed
                    dark
                    rounded
                    style="text-transform: none !important;"
                    color="green accent-3"
                    @click="dialogLayanan=true, dialogDetail=false"
                    class="mr-4"
                >
                <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Transaksi
                </v-btn>
            </v-flex>
        </v-card-title>
         <v-container>
            
            
              <v-row dense>
                <v-col cols="12" v-for="detail in details" :key="detail.noTransaksi && detail.idLayanan">
                   <v-card color="#272727">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="headline">{{detail.namaLayanan}} {{detail.namaJenis}} {{detail.namaUkuran}}</v-card-title>
                <v-card-subtitle >Rp {{detail.harga}},00</v-card-subtitle>
                <v-card-subtitle >1 layanan</v-card-subtitle>
              </div>
                <v-icon style="margin-right:30px;" color="error" @click="deleteDetailLayanan(detail)">mdi-delete</v-icon>
            </div>
          </v-card>
                </v-col>
              </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn v-if="statusLayanan==false" color="blue darken-1" text @click="dialogDetail=false, getData()">Simpan</v-btn>
            <v-btn v-if="statusLayanan==true" color="blue darken-1" text @click="dialogDetail=false, updateTotalBiaya(noTransaksi);">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogLayanan" persistent max-width="600">
      <v-card>
        <v-toolbar>
          <v-flex xs6>
            <v-toolbar-title>Daftar Layanan</v-toolbar-title>
          </v-flex>
          <v-flex xs6 class="text-right">
            <v-text-field v-model="search" append-icon="mdi-search" label="Search" hide-details></v-text-field>
            </v-flex>
        </v-toolbar>
      <v-card-text >
         <v-container>
              <v-row dense>
                <v-col cols="12" v-for="layanan in filteredListLayanan" :key="layanan.idLayanan">
                   <v-card color="#272727" @click="sendDtTransaksi(layanan.idLayanan)">
                        <div class="d-flex flex-no-wrap justify-space-between">
                        <div>
                            <v-card-title class="headline">{{layanan.namaLayanan}}</v-card-title>
                            <v-card-subtitle >{{layanan.namaUkuran}}</v-card-subtitle>
                        </div>
                            <v-card-title >Rp {{layanan.harga}},00</v-card-title>
                        </div>
                    </v-card>
                </v-col>
              </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogLayanan=false, dialogDetail=true">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
        {{ text }}
        <v-btn dark text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon 
        v-if="item.statusPembayaran=='Belum Bayar'"
        color="indigo" 
        @click="getDetailLayanan(item.noTransaksi),
        dialogDetail=true, noTransaksi = item.noTransaksi, idHewan = item.idHewan">
        mdi-pencil
      </v-icon>
      <v-icon v-if="item.statusPembayaran=='Belum Bayar'" color="error" @click="deleteData(item.noTransaksi)">mdi-delete</v-icon>
      <v-icon v-if="item.totalBiaya!=0" color="green" @click="updateStatusLayanan(item.noTransaksi)">mdi-check</v-icon>
    </template>
  </v-data-table>
</template>
    

<script>
export default {
  data: () => ({
    dialogTambah: false,
    dialogDetail: false,
    dialogLayanan: false,
    noTransaksi:"",
    statusLayanan:false,
    idHewan:"",
    search:"",
    items: [],
    keyword: "",
    headers: [
      {
        text: "No. Transaksi",
        value: "noTransaksi"
      },
      {
        text: "Tanggal Transaksi",
        value: "tglTransaksi"
      },
      {
        text: "Total Biaya",
        value: "totalBiaya"
      },
      {
        text: "Status Layanan",
        value: "statusLayanan"
      },
      {
        text: "Status Pembayaran",
        value: "statusPembayaran"
      },
      {
        text: "Nama Customer",
        value: "namaCustomer"
      },
      {
        text: "Dilayani oleh",
        value: "idCustomerService"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
    noTransaksi:"",
    transaksis: [],
    customers: [],
    pegawais: [],
    details: [],
    hewans: [],
    layanans: [],
    snackbar: false,
    color: null,
    text: "",
    load: false,
    form: {
      noTransaksi: "",
      idCustomer: "",
      namaCustomer: "",
      statusPembayaran: "",
      idCS: "",
      namaCS: "",
      idKasir: "",
      namaKasir: "",
      totalBiaya: 0,
      membership: ""
    },
    detailTransaksis: [
      {
        noTransaksi: "",
        idLayanan: "",
        namaLayanan: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0
      }
    ],
    temp: [],
    transaksi: new FormData(),
    DTTransaksi: new FormData(),
    typeInput: "new",
    statusMember: 0
  }),

  computed: {
      filteredList() {
        return this.hewans.filter(hewan => {
          return hewan.namaHewan.toLowerCase().includes(this.search.toLowerCase())
        })
      },
      filteredListLayanan(){
        return this.layanans.filter(layanan => {
          return layanan.namaLayanan.toLowerCase().includes(this.search.toLowerCase())
        })
      }
    },

  methods: {
    getData() {
      var uri = this.$apiUrl + "transaksiLayanan/tampil";
      this.$http.get(uri).then(response => {
        this.transaksis = response.data.transaksiLayanan;
      });
    },
    getHewan() {
      var uri = this.$apiUrl + "transaksiLayanan/tampilHewanCustomer";
      this.$http.get(uri).then(response => {
        this.hewans = response.data.transaksiLayanan;
      });
    },
    getLayanan() {
      var uri = this.$apiUrl + "layanan";
      this.$http.get(uri).then(response => {
        this.layanans = response.data.layanan;
      });
    },
    getDetailLayanan(noTransaksi) {
      var uri = this.$apiUrl + "dtLayanan/tampil/" + noTransaksi;
      this.$http.get(uri).then(response => {
        this.details = response.data.DTLayanan;
        this.dialogDetail = true;

        var subtotal = 0;
        for(var i=0; i<this.details.length; i++)
        {
            subtotal = parseFloat(subtotal) + parseFloat(this.details[i].harga);
        }

        this.transaksi.append('totalBiaya',subtotal);
        this.transaksi.append('idCustomerService',this.idCS);
        var uri = this.$apiUrl + "transaksiLayanan/updateTotalBiaya/" + noTransaksi;
        this.$http.post(uri,this.transaksi).then(response => {
            
        });

        var uri = this.$apiUrl + "layanan";
        this.$http.get(uri).then(response => {
            this.layanans = []
          for(var i=0; i<response.data.layanan.length; i++)
          {
            if(this.cekSameData(response.data.layanan[i].idLayanan) == false)
            {
                this.layanans.push(response.data.layanan[i]);
            }
          }
        });
        
      });
    },
    
    cekSameData: function (idLayanan) {
      for(var i=0; i<this.details.length; i++)
      {
          if(this.details[i].idLayanan === idLayanan)
          {
            return true;
          }
      }
      return false;
    },

    updateTotalBiaya(noTransaksi)
    {
      var uri = this.$apiUrl + "dtLayanan/tampil/" + noTransaksi;
      this.$http.get(uri).then(response => {
        this.details = response.data.DTLayanan;
        this.dialogDetail = true;

        var subtotal = 0;
        for(var i=0; i<this.details.length; i++)
        {
            subtotal = parseFloat(subtotal) + parseFloat(this.details[i].harga);
        }

        this.transaksi.append('totalBiaya',subtotal);
        this.transaksi.append('idCustomerService',this.idCS);
        var uri = this.$apiUrl + "transaksiLayanan/updateTotalBiaya/" + noTransaksi;
        this.$http.post(uri,this.transaksi).then(response => {
            
        });
      });
    },

    sendData(item) {
      var uri = this.$apiUrl + "transaksiLayanan";
      this.transaksi.append("idCustomer", item.idCustomer);
      this.transaksi.append("idHewan", item.idHewan);
      this.transaksi.append("idCustomerService", this.idCS);
      this.load = true;
      this.$http
        .post(uri, this.transaksi)
        .then(response => {
            this.snackbar = true; 
            this.color = "green"; 
            this.text = response.data.status; 
            this.load = false;
            this.noTransaksi = response.data.transaksiLayanan[0].noTransaksi;
            this.idHewan = response.data.transaksiLayanan[0].idHewan;
            this.getDetailLayanan(response.data.transaksiLayanan[0].noTransaksi);
            this.dialogTambah = false;
        })
        .catch(error => {
          this.load = false;
          this.dialog = false;
        });
    },

    sendDtTransaksi(idLayanan) {
      var uri = this.$apiUrl + "dtLayanan";
        this.DTTransaksi.append("noTransaksi", this.noTransaksi);
        this.DTTransaksi.append("idLayanan", idLayanan);
        this.DTTransaksi.append("idHewan", this.idHewan);
        this.$http
          .post(uri, this.DTTransaksi)
          .then(response => {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialogLayanan = false;
            this.dialogDetail = true;
            this.updateTotalBiaya(this.noTransaksi);
            this.getDetailLayanan(this.noTransaksi);
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
            this.load = false;
          });
    },

    cek($noTransaksi, $idP) {
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noTransaksi == $noTransaksi) {
          if (this.details[i].idLayanan == $idP) return 1;
        }
      }
      return 0;
    },
    editHandler(item) {
      // this.getDetailByPO(item);
      this.typeInput = "edit";
      this.dialog = true;
      this.noTransaksi = item.noTransaksi;
      this.form.noTransaksi = item.noTransaksi;
      this.form.statusPembayaran = item.statusPembayaran;
      this.form.totalBiaya = item.totalBiaya;
      for (var i = 0; i < this.customers.length; i++) {
        if (this.customers[i].idCustomer == item.idCustomer) {
          this.form.idCustomer = this.customers[i].idCustomer;
        }
      }
      this.detailTransaksis = [];
      for (var i = 0; i < this.details.length; i++) {
        if (this.details[i].noTransaksi == item.noTransaksi) {
          this.details[i].subtotal =
            this.details[i].jumlah * this.details[i].harga;
          this.details[i].idLayanan = this.details[i].idLayanan;
          this.detailTransaksis.push(this.details[i]);
        }
      }
    },
    updateStatusLayanan(noTransaksi) {
      this.transaksi.append("idCustomerService", this.idCS);
      var uri = this.$apiUrl + "transaksiLayanan/updateStatusLayanan/" + noTransaksi;
      this.load = true;
      this.$http
        .post(uri, this.transaksi)
        .then(response => {
          this.load = false;
          this.snackbar = true;
          this.text = response.data.message;
          this.color = "green";
          this.getData()
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
    deleteData(noTransaksi) {
      var uri;
      if (confirm("Apakah Anda ingin menghapus Transaksi ini?")) {
        uri = this.$apiUrl + "transaksiLayanan/" + noTransaksi;
        this.$http
          .delete(uri, this.transaksi)
          .then(response => {
            this.snackbar = true;
            this.text = response.data.status;
            this.color = "green";
            this.getData();
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
    },
    deleteDetailLayanan(item) {
      var uri = this.$apiUrl + "dtLayanan/delete";
      this.DTTransaksi.append("noTransaksi", item.noTransaksi);
      this.DTTransaksi.append("idLayanan", item.idLayanan);
      this.$http
        .post(uri, this.DTTransaksi)
        .then(response => {
          this.snackbar = true;
          this.text = response.data.status;
          this.color = "green";
          this.getDetailLayanan(item.noTransaksi);
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
        });
    },
  },
  mounted() {
    this.getData();
    this.getHewan();
    this.idCS = this.$session.get("NIP");
  }
};
</script>