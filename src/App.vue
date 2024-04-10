<script setup lang="ts">
import { ref } from 'vue';

import AppHeader from './components/app-header.vue';
import VueGantt from './library/vue-gantt/vue-gantt.vue';

const view = ref<'tasks' | 'users'>('tasks');
const showLinks = ref(true);
const showDates = ref(true);
const withoutWeekends = ref(false);
const showNet = ref(true);
const showClosed = ref(true);
const todayTrigger = ref(false);
</script>

<template>
  <div>
    <AppHeader
      v-model:view="view"
      v-model:show-links="showLinks"
      v-model:show-dates="showDates"
      v-model:without-weekends="withoutWeekends"
      v-model:show-net="showNet"
      v-model:show-closed="showClosed"
      v-model:today-trigger="todayTrigger"
    />

    <VueGantt
      :view="view"
      :show-links="showLinks"
      :show-dates="showDates"
      :without-weekends="withoutWeekends"
      :show-net="showNet"
      :show-closed="showClosed"
      :today-trigger="todayTrigger"
    />
  </div>
</template>

<style lang="scss">
@import './style/normalize.scss';
@import './style/global.scss';
</style>
