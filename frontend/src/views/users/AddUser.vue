<template>
  
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Utilizador"/>
     
      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="add">
            <div class="form-group">
              <input
                v-model="name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve nome"
                required
              />
            </div>
            <div class="form-group">
              <select id="sltType" class="form-control form-control-lg" v-model="type" required>
                <option value>-- SELECIONA TIPO --</option>
                <option value="admin">ADMINISTRADOR</option>
                <option value="caregiver">CUIDADOR</option>
                <option value="user">UTILIZADOR NORMAL</option>
              </select>
            </div>
            <div class="form-group">
              <input
                v-model="location.city"
                type="text"
                class="form-control form-control-lg"
                id="txtCity"
                placeholder="escreve cidade"
                
              />
            </div>
            <div class="form-group">
              <input
                v-model="location.country"
                type="text"
                class="form-control form-control-lg"
                id="txtCountry"
                placeholder="escreve país"
                
              />
            </div>
            <div class="form-group">
              <input
                v-model="auth.username"
                type="text"
                value="ricardo.queiros@gmail.com"
                class="form-control form-control-lg"
                id="txtEmail"
                placeholder="escreve username"
                required
              />
            </div>
            <div class="form-group">
              <input
                v-model="auth.password"
                type="password"
                class="form-control form-control-lg"
                id="txtPassword"
                placeholder="escreve password"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                class="form-control form-control-lg"
                id="txtConfirmPassword"
                placeholder="confirma password"
                required
              />
            </div>
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-plus-square"></i> ADICIONAR
            </button>
            <router-link
              :to="{name: 'listUsers'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            >
            <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_USER } from "@/store/users/user.constants";
import HeaderPage from "@/components/HeaderPage.vue"
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddUser",
   components: {
    HeaderPage
  },
  data: () => {
    return {
      location: { city: "", country: "" },
      auth: { username: "", password: "" },
      active: true,
      name: "",
      type: "",
      description: ""
    };
  },
  computed: {
     ...mapGetters("user", ["getMessage"]),
  },
  methods: {
    add() {
      if (
        document.querySelector("#txtPassword").value !==
        document.querySelector("#txtConfirmPassword").value
      ) {
        this.$alert(
          "Campos password não coincidem",
          "Erro de validação do formulário",
          "error"
        );
      } else {
        this.$store.dispatch(`user/${ADD_USER}`, this.$data).then(
          () => {
            this.$alert(
              this.getMessage,
              "Utilizador adicionado!",
              "success"
            );
            router.push({name: 'listUsers'});
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
      }
    }
  }
};
</script>