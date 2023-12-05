import { boot } from "quasar/wrappers";
import axios from "axios";
import { useQuasar } from "quasar";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
/*const api = axios.create({
  baseURL: "http://sistema.ieenayarit.org:9170/api",
});*/

const api = axios.create({
  baseURL: "http://oficialia-de-partes.ieebc.mx:9095/api",
});
//const api = axios.create({ baseURL: "https://sistema.ieenayarit.org:9270/api" });
api.interceptors.request.use((config) => {
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem("key")}`,
  };
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Esto es error", error);
    if (error.response.status == 401) {
      alert("Su sesión ha expirado, sera redireccionado al logín");
      localStorage.clear();
      window.location = "http://oficialia-de-partes.ieebc.mx:9099?return=false";
    }
    return Promise.reject();
  }
);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export { api };
