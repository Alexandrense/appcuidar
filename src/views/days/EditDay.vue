<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Registo" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <select id="sltUtente" class="form-control form-control-lg" v-model="day.patient" placeholder="utente" required>
                <option v-for="option in patients" :key="option._id" :value="option._id">
                  {{ option.name }}
                </option>
              </select>
            </div>
            <div class="form-group">              
            <input
              v-model="day.registryDate"
              type="date"
              onmouseenter="(this.type='date')"
              onmouseleave="(this.type='text')"
              class="form-control form-control-lg"
              id="txtBirthDate"
              placeholder="data do registo"
              required
            />
            </div>
            <div class="form-group">
              <select id="sltBath" class="form-control form-control-lg" v-model="day.bath" required>                
                <option value>-- BANHO --</option>
                <option value="não">NÃO</option>
                <option value="sim">SIM</option>
                <option value="recusou">RECUSOU</option>
              </select>
            </div>
            <div class="form-group">
              <input
                v-model="day.bloodPressure"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve pressão sanguinea"
              />
            </div>
            <div class="form-group">
              <input
                v-model="day.temperature"
                type="text"
                class="form-control form-control-lg"
                id="txtName"
                placeholder="escreve temperatura corporal"
              />
            </div>
            <div class="form-group">
              <select id="sltDayClassification" class="form-control form-control-lg" v-model="day.dayClassification">                
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
                v-model="day.description"
                required
              ></textarea>
            </div>
           
            <button type="submit" class="btn btn-outline-success btn-lg mr-2">
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{name: 'listDays'}"
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
import { EDIT_SPONSOR } from "@/store/dailyregistries/day.constants";
import { FETCH_QUIZZES } from "@/store/patients/patient.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";

export default {
  name: "EditSponsor",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      day: {},
      patients: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("sponsor", ["getSponsorsById", "getMessage"]),
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
    update() {
      this.$store.dispatch(`sponsor/${EDIT_SPONSOR}`, this.$data.day).then(
        () => {
          this.$alert(this.getMessage, "Registo atualizado!", "success");
          router.push({ name: "listDays" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    this.day = this.getSponsorsById(this.$route.params.sponsorId);
    this.day.registryDate = this.day.registryDate.split('T')[0];
    this.fetchPatients();
  }
};
</script>

<style scoped>
.center_div {
  margin: 0 auto;
  width: 80%;
}
</style>