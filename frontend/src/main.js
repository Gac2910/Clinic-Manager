import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const Vue = createApp(App);

Vue.use(router);

Vue.mount("#app");

// added feature to appointments to be able to click on doctor or patient name for more info
// added simple input validation
// added 