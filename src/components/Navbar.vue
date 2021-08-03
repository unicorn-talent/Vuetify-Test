<template>
    <v-app-bar app dark>
        <v-app-bar-nav-icon @click="drawer = true" class="d-flex d-md-none"></v-app-bar-nav-icon>

        <router-link to="/" class="white--text text-decoration-none">
            <span class="mx-2 headline">Test Task</span>
        </router-link>

        <v-spacer></v-spacer>

        <v-btn text to="/" class="d-none d-md-flex">OrderBook</v-btn>
        <v-btn text to="/chart" class="d-none d-md-flex">Chart</v-btn>
        <v-btn text to="/metamask" class="d-none d-md-flex">Metamask</v-btn>
    </v-app-bar>
</template>

<script>
export default {
    name: "Navbar",
    data() {
        return {
            drawer: false,
            selectedPage: null,
            routes: ["/", "/chart", "/metamask"]
        }
    },
    watch: {
        selectedPage() {
            if (this.selectedPage === undefined) return
            let path = this.routes[this.selectedPage];
            if (this.$route.path !== path) this.$router.push(path);
        }
    }
}
</script>

<style>

</style>