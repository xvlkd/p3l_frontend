<template>
  <div>
    <v-navigation-drawer v-model="drawer" class="greydarken-3" dark app clipped fixed temporary>
      <v-list-item two-line>
        <v-list-item-avatar>
          <img src="https://randomuser.me/api/portraits/women/81.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{nip}}</v-list-item-title>
          <v-list-item-subtitle>Logged In</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list>
        <v-list-item v-for="item in items" :key="item.title" link @click="$router.push(item.to)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout()">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar dark app fixed clipped-left height="70px" color="grey darken-3">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

      <VSpacer />
    </v-app-bar>

    <VContent>
      <router-view />
    </VContent>
  </div>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      {
        title: "Customer",
        icon: "mdi-account-box-multiple",
        to: "/Customer"
      },
      {
        title: "Hewan",
        icon: "mdi-dog-service",
        to: "/Hewan"
      }
    ],
    nip: localStorage.getItem("NIP")
  }),

  created() {
    this.setup;
  },

  methods: {
    logout() {
      this.$router.push({ name: "Login Page" });
      localStorage.removeItem("NIP");
    }
  }
};
</script>