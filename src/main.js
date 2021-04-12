import Vue from "vue";
import App from "./App.vue";
import VueSocialSharing from "vue-social-sharing";
import Vuelidate from "vuelidate";

import VueApollo from "vue-apollo";

import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";

Vue.config.productionTip = false;

const getHeaders = () => {
  const headers = {};
  const token = localStorage.getItem("apolloToken");
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  return headers;
};

const link = new HttpLink({
  uri: "http://localhost:3000/graphql",
  fetch,
  headers: getHeaders(),
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache({
    addTypename: true,
  }),
});

const apolloProvider = new VueApollo({
  defaultClient: client,
});

Vue.use(VueSocialSharing);
Vue.use(Vuelidate);
Vue.use(VueApollo);

new Vue({
  render: (h) => h(App),
  apolloProvider,
}).$mount("#app");
