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
          @click="dialog=true"
          class="mr-4"
        >
          <v-icon size="10" class="mr-2">mdi-pencil-plus</v-icon>Tambah Transaksi
        </v-btn>
      </v-toolbar>

      <v-dialog v-model="dialog" persistent max width="650" >
        <v-card>
          <v-card-text>
            <v-container>
              <v-col cols="12">
                <v-card-title> Data Transaksi Layanan </v-card-title>
                <v-text-field
                  class="mt-4"
                  v-if="typeInput === 'edit'"
                  v-model="form.noTransaksi"
                  label="Nomor Transaksi"
                  outlined
                  readonly
                ></v-text-field>
              </v-col>

              <v-row>
                <!-- <v-col cols="4">
                  <div v-if="typeInput === 'edit'">
                    Status Pembayaran*
                    <v-radio-group v-model="form.statusPembayaran" row>
                      <v-radio label="Sudah Bayar" value="Sudah Bayar"></v-radio>
                      <v-radio label="Belum Bayar" value="Belum Bayar"></v-radio>
                    </v-radio-group>
                  </div>
                </v-col>-->

                <v-col cols="4" v-if="typeInput==='edit'">
                  <v-text-field
                    label="Total Harga"
                    v-model.number="form.totalBiaya"
                    background-color="blue-grey darken-1"
                    prefix="Rp"
                    readonly
                    filled
                    rounded
                  ></v-text-field>
                </v-col>
              </v-row>

              <!-- <v-col cols="4"> -->
              <v-row>
                <v-col cols="3">
                  <div>
                    Membership* 
                    <v-btn-toggle v-model="form.membership" column>
                      <v-btn label="Member" value="Member" @click="member=true">Member</v-btn>
                      <v-spacer></v-spacer>
                      <v-btn label="Non Member" value="Non-Member" @click="nonmember=true">Non Member</v-btn>
                    </v-btn-toggle>
                  </div>
                </v-col>

                <v-dialog v-model="member" presistent max-width="400">
                  <v-card>
                    <v-card-text>
                      <v-container>
                        <v-col cols="11">
                          <v-select 
                              :items="customers"
                              :menu-props="{ top: true, offsetY: true }"
                              item-text="namaCustomer"
                              item-value="idCustomer"
                              label="Nama Customer*"
                              dense
                              outlined
                              rounded
                              v-model="form.idCustomer"
                              required>
                          </v-select>
                          <v-select 
                              :items="hewans"
                              :menu-props="{ top: true, offsetY: true }"
                              item-text="namaHewan"
                              item-value="idHewan"
                              label="Nama Hewan*"
                              dense
                              outlined
                              rounded
                              v-model="form.idHewan"
                              required>
                          </v-select>
                        </v-col>
                      </v-container>
                      Data Layanan
                      <div
                        class ="form-row"
                        v-for="(detailTransaksi,index) in detailTransaksis"
                        :key="index">
                          <v-row>

                            <v-col cols="11">
                              <v-autocomplete
                                v-model="detailTransaksi.idLayanan"
                                :items="layanans"
                                item-text="namaLayanan"
                                item-value="idLayanan"
                                label="Nama Layanan*"
                                @change="hitungSubTotal(index),hitungTotal()"
                                required
                                outlined
                                rounded
                              ></v-autocomplete>
                            </v-col>

                            <v-col cols="11" >
                              <v-text-field
                                v-model="detailTransaksi.jumlah"
                                required
                                type="number"
                                label="Jumlah*"
                                @change="hitungSubTotal(index),hitungTotal()"
                                clearable
                                outlined
                                rounded
                              ></v-text-field>
                            </v-col>

                            <v-col cols="11">
                              <v-text-field
                                v-model="detailTransaksi.harga"
                                label="Harga"
                                readonly
                                outlined
                                rounded
                                prefix="Rp"
                              ></v-text-field>
                            </v-col>

                            <v-col cols="11">
                              <v-text-field
                                v-model="detailTransaksi.subtotal"
                                label="Subtotal"
                                number
                                readonly
                                outlined
                                rounded
                                prefix="Rp"
                              ></v-text-field>
                            </v-col>
                            
                            <v-col cols="1">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <div v-on="on">
                                    <v-btn
                                      color="red lighten-2"
                                      icon
                                      @click="hitungTotal(), deleteDetailLayanan(index), deleteRow(index)"
                                      class="pt-3"
                                    >
                                      <v-icon>mdi-close</v-icon>
                                    </v-btn>
                                  </div>
                                </template>
                                <span>Hapus Layanan</span>
                              </v-tooltip>
                            </v-col>
                          </v-row>
                      </div>
                      <v-row>
                        <v-col cols="1" align-end justify-end>
                          <v-tooltip top>
                            <template v-slot:activator="{ on }">
                              <div v-on="on">
                                <v-btn color="green" icon fab @click="addRow()">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </div>
                            </template>
                            <span>Tambah Layanan</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                      <div class="mt-4">
                        <small>*indicates required field</small>
                      </div>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red darken-1"
                        text
                        @click="dialog=false, resetForm(), resetDynamicForm()"
                      >Close</v-btn>
                      <v-btn color="blue darken-1" text @click="setForm()">Save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>


                <v-dialog v-model="nonmember" persistent max-width="400">
                  <v-card>
                    <v-card-text>
                      <v-container>
                        <v-col cols="12">
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
                        </v-col>
                      </v-container>
                    </v-card-text>
                  </v-card>
                </v-dialog>

              </v-row>
              <!-- </v-col> -->
            </v-container>
          </v-card-text>
          <v-divider />
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
        {{ text }}
        <v-btn dark text @click="snackbar=false">Close</v-btn>
      </v-snackbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-icon color="indigo" @click="editHandler(item)">mdi-pencil</v-icon>
      <v-icon color="error" @click="deleteData(item.noTransaksi)">mdi-delete</v-icon>
    </template>
  </v-data-table>
</template>
    

<script>
export default {
  data: () => ({
    member: false,
    nonmember: false,
    dialog: false,
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
        text: "Pembayaran ke",
        value: "idKasir"
      },
      {
        text: "Action",
        value: "actions",
        sortable: false
      }
    ],
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
  methods: {
    getData() {
      var uri = this.$apiUrl + "transaksiLayanan";
      this.$http.get(uri).then(response => {
        this.transaksis = response.data.transaksiLayanan;
      });
    },

    getCustomer() {
      var uri = this.$apiUrl + "customer";
      this.$http.get(uri).then(response => {
        this.customers = response.data.customer;
        this.form.idCustomer = response.data.customer[0].idCustomer;
      });
    },

    getKasir() {
      var uri = this.$apiUrl + "pegawai/kasir/hehe";
      this.$http.get(uri).then(response => {
        this.pegawais = response.data.pegawai;
      });
    },

    getHewan() {
      var uri = this.$apiUrl + "hewan";
      this.$http.get(uri).then(response => {
        this.hewans = response.data.hewan;
      });
    },

    getLayanan() {
      var uri = this.$apiUrl + "layanan";
      this.$http.get(uri).then(response => {
        this.layanans = response.data.layanan;
      });
    },

    getDetailLayanan() {
      var uri = this.$apiUrl + "dtLayanan";
      this.$http.get(uri).then(response => {
        this.details = response.data.DTLayanan;
      });
    },

    hitungSubTotal(index) {
      var uri =
        this.$apiUrl + `layanan/cari/${this.detailTransaksis[index].idLayanan}`;
      this.$http.get(uri).then(response => {
        this.detailTransaksis[index].harga = response.data.layanan[0].harga;
        this.detailTransaksis[index].subtotal =
          this.detailTransaksis[index].harga *
          this.detailTransaksis[index].jumlah;
      });
    },

    hitungTotal() {
      this.form.totalBiaya = 0;
      for (var i = 0; i < this.detailTransaksis.length; i++) {
        parseInt(
          (this.form.totalBiaya =
            this.form.totalBiaya + this.detailTransaksis[i].subtotal)
        );
      }
    },

    sendData() {
      var uri = this.$apiUrl + "transaksiLayanan";
      if (this.statusMember == 1) {
        this.transaksi.append("idCustomer", this.form.idCustomer);
      }
      this.transaksi.append("idCustomerService", this.idCS);
      this.transaksi.append("totalBiaya", this.form.totalBiaya);
      this.load = true;
      this.$http
        .post(uri, this.transaksi)
        .then(response => {
          if (typeInput === "new") {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialog = false;
            this.getData();
          } else {
            this.sendDtTransaksi();
          }
        })
        .catch(error => {
          this.load = false;
          this.dialog = false;
          this.getData();
        });
    },

    sendDtTransaksi() {
      var uri;
      var noTransaksi = this.form.noTransaksi;
      for (var i = 0; i < this.detailTransaksis.length; i++) {
        if (this.typeInput == "edit") {
          if (this.cek(noTransaksi, this.detailTransaksis[i].idLayanan) == 1)
            uri = this.$apiUrl + "dtLayanan/update";
          else uri = this.$apiUrl + "dtLayanan";
        } else {
          uri = this.$apiUrl + "dtLayanan";
        }

        this.DTTransaksi.append("noTransaksi", noTransaksi);
        this.DTTransaksi.append("idLayanan", this.detailTransaksis[i].idLayanan);
        this.DTTransaksi.append("jumlah", this.detailTransaksis[i].jumlah);

        this.$http
          .post(uri, this.DTTransaksi)
          .then(response => {
            this.snackbar = true; //mengaktifkan snackbar
            this.color = "green"; //memberi warna snackbar
            this.text = response.data.status; //memasukkan pesan kesnackbar
            this.load = false;
            this.dialog = false;
            this.getData();
          })
          .catch(error => {
            this.errors = error;
            this.snackbar = true;
            this.text = "Try Again";
            this.color = "red";
            this.load = false;
          });
      }
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

    updateData() {
      this.transaksi.append("idCustomer", this.form.idCustomer);
      this.transaksi.append("idCustomerService", this.idCS);
      this.transaksi.append("totalBiaya", this.form.totalBiaya);

      var uri = this.$apiUrl + `transaksiLayanan/${this.noTransaksi}`;
      this.load = true;
      this.$http
        .post(uri, this.transaksi)
        .then(response => {
          this.updateStok();
          this.sendDtTransaksi();
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

    deleteDetailLayanan(index) {
      var uri = this.$apiUrl + "dtLayanan/delete";
      var noTransaksi = this.form.noTransaksi;
      var idLayanan = this.detailTransaksis[index].idLayanan;

      this.DTTransaksi.append("noTransaksi", noTransaksi);
      this.DTTransaksi.append("idLayanan", idLayanan);
      this.$http
        .post(uri, this.DTTransaksi)
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
    },

    setForm() {
      if (this.typeInput === "new") {
        this.sendData();
      } else {
        this.updateData();
      }
    },

    resetForm() {
      this.typeInput = "new";

      this.form = {
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
      };
    },

    resetDynamicForm() {
      while (this.detailTransaksis.length != 0) {
        for (var i = 0; i < this.detailTransaksis.length; i++) {
          this.detailTransaksis.splice(this.detailTransaksis[i], 1);
          this.temp.push(this.detailTransaksis[i]);
          console.log(this.temp);
        }
      }
    },
    deleteRow(index) {
      this.detailTransaksis.splice(index, 1);
    },

    addRow() {
      this.detailTransaksis.push({
        namaLayanan: "",
        jumlah: 0,
        harga: 0,
        subtotal: 0
      });
    },
  },

  mounted() {
    this.getData();
    this.getKasir();
    this.getHewan();
    this.getLayanan();
    this.getCustomer();
    this.getDetailLayanan();
    this.idCS = this.$session.get("NIP");
  }
};
</script>
