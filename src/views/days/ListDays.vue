<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Registos Diários" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link v-if="getUserType == 'admin' || getUserType == 'caregiver'"
            :to="{name:'addDay'}"
            tag="button"
            class="btn btn-outline-success mr-2 mt-2"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR REGISTO DIÁRIO
          </router-link>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
      
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
          <b-col>
            <div class="form-group">
              <select id="sltUtente" class="form-control form-control-lg" v-model="filterPatient">
                <option value>-- SELECIONE O UTENTE --</option>
                <option v-for="option in patients" :key="option._id" :value="option._id">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </b-col>
        <b-col cols="2"></b-col>
      </b-row>

      <!--TABLE-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  Data
                  <i class="fas fa-arrow-up" v-if="sortType===1" @click="sort()"></i>
                  <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                </th>
                <th scope="col">Classificação</th>              
                <th scope="col">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sponsor of filteredRegistries" :key="sponsor._id">
                <td class="pt-4">{{showHumanDate(sponsor.registryDate)}}</td>             
                <td class="pt-4">{{sponsor.dayClassification}}</td>
                <td>
                  <router-link v-if="getUserType == 'admin' || getUserType == 'caregiver'"
                    :to="{name:'editDay', params:{sponsorId: sponsor._id}}"
                    tag="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  >
                    <i class="fas fa-edit"></i> EDITAR
                  </router-link>       
                  <button
                    @click="viewUser(sponsor._id)"
                    type="button"
                    class="btn btn-outline-success mr-2 mt-2"
                  ><i class="fas fa-search"></i> VER</button>
                  <button v-if="getUserType == 'admin'"
                    @click="removeSponsor(sponsor._id)"
                    type="button"
                    class="btn btn-outline-danger mr-2 mt-2"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
    
  </section>
</template>

<script>
import { FETCH_SPONSORS, REMOVE_SPONSOR } from "@/store/dailyregistries/day.constants";
import { FETCH_QUIZZES } from "@/store/patients/patient.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";

export default {
  name: "ManageSponsors",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      sponsors: [],
      patients: [],
      filterPatient: "",
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"]),
    ...mapGetters("quiz", ["getQuizzes"]),
    ...mapGetters({ user: "auth/getProfile" }),
    ...mapGetters("auth", [
      "getUserType",
    ]),
    filteredRegistries() {
      return this.sponsors.filter(item => {
        let filterGroupResult = true;
        filterGroupResult = item.patient == this.filterPatient;
        return filterGroupResult;
      });
    },
  },
  methods: {
    getPatientName(id) {
      let patientItem = this.patients.filter(item => item._id == id);
      return patientItem[0].name;
    },
    fetchPatients() {
      this.$store.dispatch(`quiz/${FETCH_QUIZZES}`).then(
        () => {
          this.patients = this.getQuizzes;
          this.patients.sort(this.compareNames);
          this.patients = this.patients.filter(item => {
            let userExists;
            userExists = item.users.filter(userItem => userItem._id == this.user._id);
            if (userExists.length > 0 || this.user.type == 'admin') {
              return true;
            }
            return false;
          });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    fetchDays() {
      this.$store.dispatch(`sponsor/${FETCH_SPONSORS}`).then(
        () => {
          this.sponsors = this.getSponsors;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sort() {
      this.sponsors.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },
    viewUser(id) {
      const dayregistry = this.sponsors.find(item => item._id === id);
      this.$fire({
        title: this.showHumanDate(dayregistry.registryDate),
        html: this.generateTemplate(dayregistry, this.getPatientName(this.filterPatient))
      });
    },
    generateTemplate(dayregistry, patientName) {
      return `
          <p>
          <b>Utente:</b> ${patientName} <br><br>
          <b>Refeições</b> <br><br>
          <b>Pequeno Almoço:</b> ${dayregistry.breakfast} <br>
          <b>Almoço:</b> ${dayregistry.lunch} <br>
          <b>Lanche:</b> ${dayregistry.coffee} <br>
          <b>Jantar:</b> ${dayregistry.dinner} <br><br>
          <b>Higiene e Saúde</b> <br><br>
          <b>Banho:</b> ${dayregistry.bath} <br>
          <b>Temperatura:</b> ${dayregistry.temperature} <br>
          <b>Pressão Sanguinea:</b> ${dayregistry.bloodPressure}<br><br>
          <b>Classificação do dia</b> <br><br>
          <b>Classificação:</b> ${dayregistry.dayClassification}<br>
          <b>Observações:</b> ${dayregistry.description}
          </p>
        `
    },
    formatDate: d => 
    {
      const newDate = new Date(Date.parse(d))
      return newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate() + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds()
    },
    showHumanDate(dateField) {
      if (dateField) {
        return dateField.split('T')[0];
      }
      return "";
    },    
    removeSponsor(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o registo?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`sponsor/${REMOVE_SPONSOR}`, id).then(() => {
            this.$alert(this.getMessage, "Registo removido!", "success");
            this.fetchDays();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchDays();
    this.fetchPatients();
  }
};
</script>