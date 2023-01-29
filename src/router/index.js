import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/admin/users",
    name: "listUsers",
    component: () => import("@/views/users/ListUsers.vue")
  },
  {
    path: "/admin/users/add",
    name: "addUser",
    component: () => import("@/views/users/AddUser.vue")
  },
  {
    path: "/admin/users/:userId",
    name: "editUser",
    component: () => import("@/views/users/EditUser.vue")
  },
  {
    path: "/admin/days",
    name: "listDays",
    component: () => import("@/views/days/ListDays.vue")
  },
  {
    path: "/admin/patients",
    name: "listPatients",
    component: () => import("@/views/patients/ListPatients.vue")
  },
  {
    path: "/admin/days/add",
    name: "addDay",
    component: () => import("@/views/days/AddDay.vue")
  },  
  {
    path: "/admin/days/:sponsorId",
    name: "editDay",
    component: () => import("@/views/days/EditDay.vue")
  },
  {
    path: "/admin/patients/add",
    name: "addPatient",
    component: () => import("@/views/patients/AddPatient.vue")
  },
  {
    path: "/admin/patients/:expertId",
    name: "editPatient",
    component: () => import("@/views/patients/EditPatient.vue")
  }, 
  {
    path: "/profile",
    name: "profile",
    component: () => import("@/views/Profile.vue"),
    meta: {
      rule: "user"
    }
  },
  {
    path: "/profile/edit",
    name: "editProfile",
    component: () => import("@/views/EditProfile.vue"),
    meta: {
      rule: "user"
    }
  },
  // Redirect to 404 page, if no match found
  {
    path: "*",
    component: () => import("@/views/Error404.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
