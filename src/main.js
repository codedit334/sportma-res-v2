import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import 'vuetify/styles'; // Ensure you are using css-loader
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({
  components,
  directives,
});

import router from "./router";

createApp(App).use(router).use(vuetify).mount("#app");
