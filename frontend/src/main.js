import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const Vue = createApp(App);

Vue.use(router);

Vue.mount("#app");

// Last feature: try to encrypt user passwords and store the encryptions in the database