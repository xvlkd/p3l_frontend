<template>
    <v-slot>
        <v-card width="100%">
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Data Produk</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6>
                        <v-btn depressed dark rounded style="text-transform: none !important;" color="green accent-3"
                            @click="dialog=true">
                            <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                            Tambah Produk
                        </v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                        </v-text-field>
                    </v-flex>
                </v-layout>

                <v-data-table :headers="headers" :items="produks" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item) in items" :key="item.idProduk">
                                <td>{{ item.idProduk }}</td>
                                <td>{{ item.namaProduk }}</td>
                                <td>{{ item.harga }}</td>
                                <td>{{ item.stok }}</td>
                                <td>
                                    <v-btn icon color="indigo" light @click="editHandler(item)">
                                        <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                    <v-btn icon color="error" light @click="deleteData(item.NIP)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </template>
                </v-data-table>
            </v-container>
        </v-card>
        <v-dialog v-model="dialog" persistent max-width="400">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    prepend-icon="mdi-rename-box"
                                    label="Nama Produk*" 
                                    v-model="form.namaProduk"
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    prepend-icon="mdi-cash-usd"
                                    label="Harga*" 
                                    v-model="form.harga" 
                                    required></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    prepend-icon="mdi-text-box-check"
                                    label="Stok*" 
                                    v-model="form.stok" 
                                    required></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    <small>*indicates required field</small>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="red darken-1" text @click="dialog=false, resetForm()">Close</v-btn>
                    <v-btn color="blue darken-1" text @click="setForm()">Tambah Pegawai</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
            {{ text }}
            <v-btn dark text @click="snackbar=false">
                Close
            </v-btn>
        </v-snackbar>
    </v-slot>
</template>
<script>
    export default {
        data: () => ({
            dialog: false,
            items: [],
            keyword: '',
            headers: [
                    {
                        text: 'ID Produk',
                        value: 'idProduk'
                    },
                    {
                        text: 'Nama Produk',
                        value: 'namaProduk'
                    },
                    {
                        text: 'Harga',
                        value: 'harga'
                    },
                    {
                        text: 'Stok Tersedia',
                        value: 'stok'
                    },
                    {
                        text: 'Action',
                        value: null
                    },
                ],
                produks: [],
                snackbar: false,
                color: null,
                text: '',
                load: false,
                form:
                {
                    idProduk: '',
                    namaProduk: '',
                    harga: '',
                    stok:''
                },
                produk: new FormData,
                typeInput: 'new',
                errors: '',
        }),
        methods: {
    
    getData(){
        var uri = this.$apiUrl + 'produk'
        this.$http.get(uri,this.produks).then(response => {
            this.produks = response.data.data
        })
    },

    sendData(){
        this.produk.append('idProduk',this.form.idProduk);
        this.produk.append('namaProduk',this.form.namaProduk);
        this.produk.append('harga',this.form.harga);
        this.produk.append('stok',this.form.stok);

        var uri = this.$apiUrl + 'produk'
        this.load = true
        this.$http.post(uri,this.produks).then(response => {
            this.snackbar =true;
            this.color = 'green';
            this.text = response.data.messege;
            this.load = false;
            this.dialog = false
            this.getData();
            this.resetForm();
                }).catch(error =>{
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                    this.load = false;
                })
    },

        deleteData(idProduk) {
            var uri = this.$apiUrl + 'produk/' + idProduk; //data dihapus berdasarkan id
                this.$http.delete(uri,this.produks).then(response => {
                    this.snackbar = true;
                    this.text = response.data.message;
                    this.color = 'green'
                    this.deleteDialog = false;
                    this.getData();
                }).catch(error => {
                    this.errors = error
                    this.snackbar = true;
                    this.text = 'Try Again';
                    this.color = 'red';
                })
        },

        setForm() {
        if (this.typeInput === 'new') {
            this.sendData()
        } else {
            console.log("dddd")
            this.updateData()
        }
    },
    resetForm() {
        this.form = {
            idProduk: '',
            namaProduk: '',
            harga: '',
            stok: '',
        }
    }
  },

  mounted() {
    this.getData();
  }
  
  }
</script>