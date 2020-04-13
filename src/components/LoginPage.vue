<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
              </v-toolbar>

              <v-card-text>
                <v-form>
                  <v-text-field
                    label="NIP"
                    prepend-icon="mdi-human-male"
                    type="text"
                    v-model="form.NIP"
                    required
                  />

                  <v-text-field
                    label="password"
                    prepend-icon="mdi-lock"
                    v-model="form.kataSandi"
                    required
                    :append-icon="!value ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="value ? 'text' : 'password'"
                    @click:append="value = !value"
                  />
                </v-form>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-snackbar v-model="snackbar" :color="color" :multi-line="true" :timeout="3000">
          {{ text }}
          <v-btn dark text @click="snackbar=false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    form: {
      NIP: "",
      kataSandi: ""
    },
    snackbar: false,
    color: null,
    text: "",
    pegawais: [],
    pegawai: new FormData(),
    value: false
  }),

  methods: {
    login() {
      this.pegawai.append("NIP", this.form.NIP);
      this.pegawai.append("kataSandi", this.form.kataSandi);
      var uri = this.$apiUrl + "pegawai/login";
      this.$http
        .post(uri, this.pegawai)
        .then(response => {
          this.snackbar = true; //mengaktifkan snackbar
          this.color = "green"; //memberi warna snackbar
          this.text = response.data.message; //memasukkan pesan kesnackbar
          sessionStorage.setItem("NIP", response.data.data.NIP);
          sessionStorage.setItem("Nama", response.data.data.namaPegawai);
          sessionStorage.setItem("Jabatan", response.data.data.jabatan);
          if (this.form.NIP == "Owner") {
            this.$router.push({ name: "OwnerProfile" });
          } else if (this.form.NIP.includes("CS")) {
            this.$router.push({ name: "CSPage" });
          } else {
            this.$router.push({ name: "KasirPage" });
          }
        })
        .catch(error => {
          this.errors = error;
          this.snackbar = true;
          this.text = "Try Again";
          this.color = "red";
        });
    }
  }
};
</script>