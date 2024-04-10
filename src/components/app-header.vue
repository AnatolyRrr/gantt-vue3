<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  view: 'tasks' | 'users';
  showLinks: boolean;
  showDates: boolean;
  withoutWeekends: boolean;
  showNet: boolean;
  showClosed: boolean;
  todayTrigger: boolean;
}>();

const emit = defineEmits([
  'update:view',
  'update:showLinks',
  'update:showDates',
  'update:withoutWeekends',
  'update:showNet',
  'update:showClosed',
  'update:todayTrigger',
]);

const viewValue = computed({
  get: () => props.view,
  set: (val) => emit('update:view', val),
});
const showLinksValue = computed({
  get: () => props.showLinks,
  set: (val) => emit('update:showLinks', val),
});
const showDatesValue = computed({
  get: () => props.showDates,
  set: (val) => emit('update:showDates', val),
});
const withoutWeekendsValue = computed({
  get: () => props.withoutWeekends,
  set: (val) => emit('update:withoutWeekends', val),
});
const showNetValue = computed({
  get: () => props.showNet,
  set: (val) => emit('update:showNet', val),
});
const showClosedValue = computed({
  get: () => props.showClosed,
  set: (val) => emit('update:showClosed', val),
});
const todayTriggerValue = computed({
  get: () => props.todayTrigger,
  set: (val) => emit('update:todayTrigger', val),
});
</script>

<template>
  <header>
    <h1>Gantt</h1>

    <div class="filters">
      <button
        type="button"
        @click="todayTriggerValue = !todayTriggerValue"
      >
        Go today
      </button>

      <div class="line" />

      <label>
        <select v-model="viewValue">
          <option value="tasks">Tasks view</option>
          <option value="users">Users view</option>
        </select>
      </label>

      <div class="line" />

      <label>
        Show links
        <input v-model="showLinksValue" type="checkbox" />
      </label>
      
      <div class="line" />

      <label>
        Show dates
        <input v-model="showDatesValue" type="checkbox" />
      </label>
      
      <div class="line" />

      <label>
        Hide weekends
        <input v-model="withoutWeekendsValue" type="checkbox" />
      </label>
      
      <div class="line" />

      <label>
        Show net
        <input v-model="showNetValue" type="checkbox" />
      </label>
      
      <div class="line" />

      <label>
        Show closed tasks
        <input v-model="showClosedValue" type="checkbox" />
      </label>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 0 16px;
  width: 100%;
  height: 60px;
  background-color: #f1f1f1;
}

.filters {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.line {
  height: 24px;
  width: 1px;
  background-color: #000000;
}

label {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>