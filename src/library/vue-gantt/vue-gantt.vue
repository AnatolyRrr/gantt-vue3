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
</script>

<template>
  <div>
    Hello!
  </div>
</template>
