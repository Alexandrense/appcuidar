<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Utentes" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="1"></b-col>
        <b-col>
          <router-link
            :to="{name:'addPatient'}"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR UTENTE
          </router-link>
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>
      <!--TABLE-->
      <b-row>
        <b-col cols="1"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  Nome
                  <i class="fas fa-arrow-up" v-if="sortType===1" @click="sort()"></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">Idade</th>  
                <th scope="col">Contato</th>
                <th scope="col">Telefone</th>  
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="patient of patients" :key="patient._id">
                <td class="pt-4">{{patient.name}}</td>
                <td class="pt-4">{{calculateAge(patient.birth_date)}}</td>             
                <td class="pt-4">{{patient.contactName}}</td>
                <td class="pt-4">{{patient.contactPhone}}</td>
                <td>
                  <router-link
                    :to="{name:'editPatient', params:{quizId: patient._id}}"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    @click="removePatient(patient._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  ><i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_QUIZZES, REMOVE_QUIZ } from "@/store/patients/patient.constants";
import { mapGetters } from "vuex";
import HeaderPage from "@/components/HeaderPage.vue"
export default {
  name: "ListPatients",
   components: {
    HeaderPage
  },
  data: function() {
    return {
      patients: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("quiz", ["getQuizzes","getMessage"])
  },
  methods: {
    fetchPatients() {
      this.$store.dispatch(`quiz/${FETCH_QUIZZES}`).then( 
        () => {
          this.patients = this.getQuizzes;
        }, err => {
          this.$alert(`${err.message}`, 'Erro', 'error');
        });
    },
    calculateAge(birthDateField) {
      if (birthDateField) {
        let currentDate = new Date(); 
        let birthDate = new Date(birthDateField);
        let difference = currentDate - birthDate;
        let age = Math.floor(difference/31557600000);
        return age
      }
      return "";
    },
    sort() {
      this.patients.sort(this.compareNames)
      this.sortType *= -1      
    },
    compareNames(q1,q2) {
      if(q1.name > q2.name) return 1 * this.sortType
      else if(q1.name < q2.name) return -1 * this.sortType
      else return 0
    },
    removePatient(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`quiz/${REMOVE_QUIZ}`, id).then(() => {
            this.$alert(
              this.getMessage,
              "Item removido!",
              "success"
            );
            this.fetchPatients();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchPatients();
  }
};
</script>