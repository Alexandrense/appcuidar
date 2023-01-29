<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Utente"/>
      
      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="add">
            <div class="form-group">
              <input
                v-model="name"
                type="text"
                class="form-control"
                id="txtName"
                placeholder="escreve o nome"
                required
              />
            </div>
            <div class="form-group">
            <input
              v-model="birth_date"
              type="text"
              onmouseenter="(this.type='date')"
              onmouseleave="(this.type='text')"
              class="form-control form-control-lg"
              id="txtBirthDate"
              placeholder="escreve data de nascimento"
              required
            />
            </div>
            <div class="form-group">
              <select id="sltSex" class="form-control form-control-lg" v-model="sex" required>
                <option value>-- SELECIONA SEXO --</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
            <div class="form-group">
              <input
                v-model="contactName"
                type="text"
                class="form-control form-control-lg"
                id="txtContactName"
                placeholder="escreve nome do contacto responsável"
                
              />
            </div>
            <div class="form-group">
              <input
                v-model="contactPhone"
                type="text"
                class="form-control form-control-lg"
                id="txtContactPhone"
                placeholder="escreve telefone do contacto responsável"
                
              />
            </div>
            <div class="form-group">
              <input
                v-model="contactMail"
                type="text"
                class="form-control form-control-lg"
                id="txtContactMail"
                placeholder="escreve e-mail do contacto responsável"
                
              />
            </div>
            
            <button
              @click="addQuestion"
              type="button"
              class="btn btn-outline-warning mr-2"
            ><i class="fas fa-plus-square"></i> ADICIONAR UTILIZADOR AO UTENTE</button>
            <br><br>

            <div v-if="users.length">
              <div class="row">
                <div class="col-md-9">
                  <h4>Lista de utilizadores</h4>
                </div>
                <div class="col-md-3">
                  <h4>Ações</h4>
                </div>
              </div>
            </div>
            
           
            <div v-for="(question, index) in users" :key="question.id">
              <div class="form-group">
                <div class="row">
                  <div class="col-md-9">
                    <select
                      v-model="question.id"
                      :key="index"
                      class="form-control"
                      required
                    >
                      <option
                        v-for="q in getQuestionsByLevel"
                        :key="q._id"
                        :value="q._id"
                      >{{q.name}} ({{q.type}})</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <button
                      @click="removeQuestion(index)"
                      type="button"
                      class="btn btn-outline-danger mr-2"
                    ><i class="fas fa-trash"></i> REMOVER</button>
                  </div>
                </div>
              </div>
            </div>
            
            <button type="submit" class="btn btn-outline-success mr-2"><i class="fas fa-save"></i> GRAVAR UTENTE</button>
            <router-link
              :to="{name: 'listPatients'}"
              tag="button"
              class="btn btn-outline-danger"
            ><i class="fas fa-window-close"></i> CANCELAR</router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_QUIZ } from "@/store/patients/patient.constants";
import HeaderPage from "@/components/HeaderPage.vue"
import { FETCH_USERS } from "@/store/users/user.constants";
import router from "@/router";

import { mapGetters } from "vuex";

export default {
  name: "AddPatient",
   components: {
    HeaderPage
  },
  data: () => {
    return {
      name: "",
      birth_date: "",
      sex: "",
      contactName: "", 
      contactPhone: "", 
      contactMail: "",
      users: [],
      myQuestions: []
    };
  },
  computed: {
    ...mapGetters("quiz", ["getMessage"]),
    ...mapGetters("user", ["getUsers"]),
    getQuestionsByLevel() {
      return this.myQuestions.filter(item => item.type != 'admin');
    }
  },
  methods: {
    
    addQuestion() {
      this.users.push({ id: "" });
    },
    removeQuestion(index) {
      this.users.splice(index, 1);
    },

    add() {
      this.users = this.users.map(question => question["id"]);
      this.$store
        .dispatch(`quiz/${ADD_QUIZ}`, {
          name: this.name,
          birth_date: this.birth_date,
          sex: this.sex,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          contactMail: this.contactMail,
          users: this.users
        })
        .then(
          () => {
            this.$alert(this.getMessage, "Utente adicionado!", "success");
            router.push({name: 'listPatients'});
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
    }
  },
  created() {
    this.$store.dispatch(`user/${FETCH_USERS}`).then(
      () => {
        this.myQuestions = this.getUsers;
      },
      err => {
        this.$alert(`${err.message}`, "Erro", "error");
      }
    );
  }
};
</script>