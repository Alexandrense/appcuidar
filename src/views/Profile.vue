<template>
  <section class="page-section">
    <b-container>
      <b-card class="overflow-hidden mt-5" style="max-width: 1540px; ">
        <HeaderPage :title="user.name.toUpperCase()" />
        <b-row>
          <b-col md="6" align="center">
            <b-card-body title="Dados pessoais" align="center">
              <b-card-text >
                <strong>Nome: </strong>{{user.name}}
                <br />
                <strong>Data de nascimento:</strong> {{setCurrentDateTime(user.birth_date)}}
                <br />
                <strong>Cidade:</strong> {{user.location.city}} | <strong>País:</strong> {{user.location.country}}
                <br>
              </b-card-text>
            </b-card-body>
          </b-col>
          <b-col md="6">
            <b-card-body title="Conta" align="center">
              <b-card-text >
                <strong>Data de registo:</strong> {{setCurrentDateTime(user.registration_date)}}
                <br />
                <strong>Username:</strong> {{user.auth.username}}
                <br />
                <strong>Tipo:</strong> {{user.type}}
                <br />
                <br/>
                
              </b-card-text>
              <br />
              <b-button variant="outline-success" class="mr-2 mt-2" @click="editProfileData()">
                <i class="fas fa-user-edit"></i> EDITAR PERFIL
              </b-button>
              <b-button variant="outline-danger" class="mr-2 mt-2" @click="logout()">
                <i class="fas fa-sign-out-alt"></i> LOGOUT
              </b-button>
            </b-card-body>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </section>
</template>

<script>
import { AUTH_LOGOUT_SUCCESS } from "@/store/auth/auth.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";
import router from "@/router";
export default {
  components: {
    HeaderPage
  },
  data: function() {
    return {
      avatar: {}
    };
  },
  computed: {
    ...mapGetters(["getUserLevelByPoints"]),
    ...mapGetters({ user: "auth/getProfile" })
  },
  methods: {
    logout() {
      this.$confirm(
        "Se sim, clique em OK",
        "Queres mesmo sair?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.commit(`auth/${AUTH_LOGOUT_SUCCESS}`);
          router.push({ name: "home" });
        },
        () => {
          this.$alert("Estás de volta!", "Informação", "info");
        }
      );
    },
    setCurrentDateTime(paramDate) {
      const date = new Date(paramDate);
      return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDay();
    },
    editProfileData() {
      router.push({name: 'editProfile'})
    }
  }
};
</script>
