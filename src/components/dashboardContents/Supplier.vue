<template>
    <v-slot>
        <v-card width="100%">
            <v-container grid-list-md mb-0>
                <h2 class="text-md-center">Data Supplier</h2>
                <v-layout row wrap style="margin:10px">
                    <v-flex xs6>
                        <v-btn depressed dark rounded style="text-transform: none !important;" color="green accent-3"
                            @click="dialog=true">
                            <v-icon size="18" class="mr-2">mdi-pencil-plus</v-icon>
                            Tambah Supplier
                        </v-btn>
                    </v-flex>
                    <v-flex xs6 class="text-right">
                        <v-text-field v-model="keyword" append-icon="mdi-search" label="Search" hide-details>
                        </v-text-field>
                    </v-flex>
                </v-layout>

                <v-data-table :headers="headers" :items="suppliers" :search="keyword" :loading="load">
                    <template v-slot:body="{ items }">
                        <tbody>
                            <tr v-for="(item) in items" :key="item.idSupplier">
                                <td>{{ item.idSupplier }}</td>
                                <td>{{ item.namaSupplier }}</td>
                                <td>{{ item.alamat }}</td>
                                <td>{{ item.noHp }}</td>
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
                        text: 'ID Supplier',
                        value: 'idSupplier'
                    },
                    {
                        text: 'Nama Supplier',
                        value: 'namaSupplier'
                    },
                    {
                        text: 'Alamat',
                        value: 'alamat'
                    },
                    {
                        text: 'No HP',
                        value: 'noHp'
                    },
                    {
                        text: 'Action',
                        value: null
                    },
                ],
                suppliers: [],
                snackbar: false,
                color: null,
                text: '',
                load: false,
        }),
        methods: {
    
    getData(){
        var uri = this.$apiUrl + 'supplier'
        this.$http.get(uri,this.suppliers).then(response => {
            this.suppliers = response.data.data
        })
    },
  },

  mounted() {
    this.getData();
  }
  
  }
</script>