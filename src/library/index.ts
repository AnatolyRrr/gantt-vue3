import VueGantt from "./vue-gantt/vue-gantt.vue";

const useGantt = {
  install: function (app: { component: (a: string, b: unknown) => void }) {
    app.component("VueGantt", VueGantt);
  },
};

export { VueGantt, useGantt };
