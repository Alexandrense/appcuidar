<template>
  <!-- Portfolio Section -->
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Registo Diário" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <form @submit.prevent="add">
            <div class="form-group">
              <select id="sltGroup" class="form-control form-control-lg" v-model="patient" required>
                <option value>-- SELECIONA UTENTE --</option>
                <option v-for="option in patients" :key="option._id" :value="option._id">
                  {{ option.name }}
                </option>
              </select>
            </div>
            <div class="form-group">              
            <input
              v-model="registryDate"
              type="date"
              onmouseenter="(this.type='date')"
              onmouseleave="(this.type='text')"
              class="form-control form-control-lg"
              id="txtRegistryDate"
              placeholder="data do registo"
              required
            />
            </div>
            <div class="form-group">
              <select id="sltBath" class="form-control form-control-lg" v-model="bath" required>                
                <option value>-- TOMOU BANHO? --</option>
                <option value="não">NÃO</option>
                <option value="sim">SIM</option>
                <option value="recusou">RECUSOU</option>
              </select>
            </div>
            <div class="form-group">
              <input
                v-model="bloodPressure"
                type="text"
                class="form-control form-control-lg"
                id="txtBloodPressure"
                placeholder="escreve pressão sanguinea"
              />
            </div>
            <div class="form-group">
              <input
                v-model="temperature"
                type="text"
                class="form-control form-control-lg"
                id="txtTemperature"
                placeholder="escreve temperatura corporal"
              />
            </div>
            <div class="form-group">
              <select id="sltDayClassification" class="form-control form-control-lg" v-model="dayClassification">                
                <option value>-- COMO FOI O DIA DO UTENTE? --</option>
                <option value="RUIM">RUIM</option>
                <option value="BOM">BOM</option>
                <option value="ÓTIMO">ÓTIMO</option>
              </select>
            </div>
            <div class="form-group">
              <textarea
                id="txtDescription"
                class="form-control form-control-lg"
                placeholder="observações"
                cols="30"
                rows="5"
                v-model="description"
              ></textarea>
            </div>
            
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-plus-square"></i>  ADICIONAR</button>
            <router-link
              :to="{name: 'listDays'}"
              tag="button"
              class="btn btn-outline-danger btn-lg"
            ><i class="fas fa-window-close"></i>  CANCELAR</router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_SPONSOR } from "@/store/dailyregistries/day.constants";
import { FETCH_QUIZZES } from "@/store/patients/patient.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "AddSponsor",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      patient: "",
      registryDate: "",
      bath: "",
      bloodPressure: "",
      temperature: "",
      dayClassification: "",
      description: "",
      patients: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsors", "getMessage"]),
    ...mapGetters("quiz", ["getQuizzes"]),
    ...mapGetters({ user: "auth/getProfile" })
  },
  methods: {    
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
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },
    add() {
      this.$store.dispatch(`sponsor/${ADD_SPONSOR}`, this.$data).then(
        () => {
          this.$alert(this.getMessage, "Registo adicionado!", "success");
          router.push({ name: "listDays" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    this.fetchPatients();
    this.registryDate = new Date().toISOString().slice(0,10);
  }
};

</script>