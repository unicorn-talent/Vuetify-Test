<template>
  <v-app>
    
    <Navbar />

    <v-main>
      <router-view></router-view>
    </v-main>

    <Footer />
  </v-app>
</template>

<script>
import Navbar from "@/components/Navbar.vue";

export default {
  name: 'App',

  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>

<style scoped>
  a {
    color: white;
    text-decoration: none;
  }
</style>