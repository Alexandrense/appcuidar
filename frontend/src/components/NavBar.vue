<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="#" class="ml-5">
        <router-link
          :to="{ name: 'home' }"
          tag="img"
          :src="require('@/assets/appcuidar_line.png')"
          style="width:250px; height:50px"
          title="AppCuidar"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav v-if="isUserLoggedIn" class="ml-auto mr-5">
          <b-nav-item :to="{ name: 'listDays' }">REGISTO DIARIO</b-nav-item>
          <b-navbar-nav v-if="getUserType != 'admin'">
            <b-nav-item :to="{ name: 'profile' }">{{getProfile.auth.username.toUpperCase()}} ({{getUserType.toUpperCase()}})</b-nav-item>
          </b-navbar-nav>
          <b-navbar-nav v-else>
            <b-nav-item :to="{ name: 'listPatients' }">UTENTES</b-nav-item>
            <b-nav-item :to="{ name: 'listUsers' }">UTILIZADORES</b-nav-item>
          </b-navbar-nav>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto mr-5" v-else>
          <b-nav-item :to="{ name: 'login' }">LOGIN</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["getUserLevelByPoints"]),
    ...mapGetters("auth", [
      "isUserLoggedIn",
      "getProfileName",
      "getUserType",
      "getProfile"
    ])
  }
};
</script>
