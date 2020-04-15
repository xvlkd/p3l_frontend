<template>
  <v-container fill-height>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="6">
        <h1>Selamat datang {{this.nama}}</h1>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    nama: "",
  }),

  mounted() {
    this.nama= this.$session.get("Nama");
  }
};
</script>