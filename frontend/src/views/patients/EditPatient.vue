<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Utente" />
      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <input
                v-model="quiz.name"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve nome"
                required
              />
            </div>
            <div class="form-group">              
            <input
              v-model="quiz.birth_date"
              type="date"
              onmouseenter="(this.type='date')"
              onmouseleave="(this.type='text')"
              class="form-control form-control-lg"
              id="txtBirthDate"
              placeholder="escreve data de nascimento"
              required
            />
            </div>
            <div class="form-group">
              <select id="sltSex" class="form-control form-control-lg" v-model="quiz.sex">                
                <option value>-- SELECIONA SEXO --</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            <div class="form-group">
              <input
                v-model="quiz.contactName"
                type="text"
                class="form-control form-control-lg"
                id="txtContactName"
                placeholder="escreve nome do contacto responsável"
                required
              />
            </div>

            <div class="form-group">
              <input
                v-model="quiz.contactPhone"
                type="text"
                class="form-control form-control-lg"
                id="txtContactPhone"
                placeholder="escreve telefone do contacto responsável"
                
              />
            </div>
            <div class="form-group">
              <input
                v-model="quiz.contactMail"
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

            <div v-if="quiz.users.length">
              <div class="row">
                <div class="col-md-9">
                  <h4>Lista de questões</h4>
                </div>
                <div class="col-md-3">
                  <h4>Ações</h4>
                </div>
              </div>
            </div>
            <div v-for="(question, index) in quiz.users" :key="question._id">
              <div class="form-group">
                <div class="row">
                  <div class="col-md-9">
                   <select
                      v-model="question._id"
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
                    >
                      <i class="fas fa-trash"></i> REMOVER
                    </button>
                  </div>
                </div>
              </div>
            </div>
            

            <button type="submit" class="btn btn-outline-success mr-2">
              <i class="fas fa-save"></i> ATUALIZAR
            </button>
            <router-link
              :to="{name: 'listPatients'}"
              tag="button"
              class="btn btn-outline-danger"
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
import { EDIT_QUIZ } from "@/store/patients/patient.constants";
import router from "@/router";
import HeaderPage from "@/components/HeaderPage.vue"
import { FETCH_USERS } from "@/store/users/user.constants";
import { mapGetters } from "vuex";

export default {
  name: "EditPatient",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      quiz: {},
      myQuestions: []
    };
  },
  computed: {
    ...mapGetters("quiz", ["getQuizById", "getMessage"]),
    ...mapGetters("user", ["getUsers"]),
    getQuestionsByLevel() {
      return this.myQuestions.filter(item => item.type != 'admin');
    }
  },
  methods: {
    addQuestion() {
      this.quiz.users.push({id:"" });
    },
    removeQuestion(index) {
      this.quiz.users.splice(index, 1);
    },
    update() {
      this.$store
        .dispatch(`quiz/${EDIT_QUIZ}`, this.$data.quiz)
        .then(
          () => {
            this.$alert(this.getMessage, "Utente atualizado!","success");
            router.push({name: 'listPatients'});
          },
          err => {
            this.$alert(`${err.message}`, "Erro", "error");
          }
        );
    }
  },
  created() {
    this.quiz = this.getQuizById(this.$route.params.quizId);
    this.quiz.birth_date = this.quiz.birth_date.split('T')[0];
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
