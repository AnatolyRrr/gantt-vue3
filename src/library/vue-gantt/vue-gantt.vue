<script setup lang="ts">
import {
  withDefaults,
  defineProps,
  defineEmits,
  ref,
  reactive,
  computed,
  watch,
} from 'vue';
import { DateTime } from 'luxon';
import { useFormatTasks } from '@/composables/format-tasks';
import { getDateInterval } from '@/utils/date';
import type { GanttProps, GanttTask } from './vue-gantt.types';

const props = withDefaults(defineProps<GanttProps>(), {
  view: 'tasks',
  scale: 'week/day',
  showLinks: true,
  showDates: true,
  showNet: true,
  showClosed: true,
});

const emit = defineEmits([
  'change-dates',
  'click-task',
  'select-task',
  'add-link',
  'remove-link',
  'change-status',
]);

const {
  openedTasks,
  openedTaskIds,
  hovers,
} = useFormatTasks(
  computed(() => props.tasks),
  computed(() => props.view),
);

const currentDateTime = DateTime.now();

const endDate = ref(DateTime.now().plus({ year: 1 }));
const smooth = ref(true);
const isDrawing = ref(false);
const sidebarRef = ref<null | HTMLElement>(null);
const supportAreaRef = ref<null | HTMLElement>(null);
const todayLineCoord = ref<number | null>(null);
const scrollXIntervalId = ref();
const scrollYIntervalId = ref();
const selectedTaskIds = ref<string[]>([]);

// const linkCoords = reactive({
//   start: null as GanttTaskCoords | null,
//   end: null as GanttTaskCoords | null,
// });

const linkLineCoords = reactive({
  startX: null as number | null,
  startY: null as number | null,
  endX: null as number | null,
  endY: null as number | null,
});

const renderKeys = reactive({
  group: 0,
  column: 0,
  body: 0,
  task: 0,
});

const changedTasksPosition = reactive({}) as {
  [key: string]: {
    left: number;
    width: number;
  };
};

const behavior = computed(() => smooth.value ? 'smooth' : 'auto');

const stepType = computed(() => {
  switch(props.scale) {
    case 'year':
      return 'year';
    case 'year/month':
      return 'month';
    default:
      return 'day';
  }
});

const startDate = computed(() => {
  if (props.creationDate) {
    return DateTime.fromISO(props.creationDate).startOf('year') as DateTime<true>
  }
  if (props.tasks.length) {
    return props.tasks.reduce((acc, task) => {
      if (task.startDate) {
        const taskDate = DateTime.fromISO(task.startDate).startOf('year') as DateTime<true>;
        return taskDate.toISODate() < acc.toISODate()
          ? taskDate
          : acc;
      }
      return acc;
    }, currentDateTime.startOf('year') as DateTime<true>)
  }
  return currentDateTime.startOf('year')  as DateTime<true>;
});

const sizes = computed(() => {
  const cellWidth = props.options?.cellWidth ?? 28;
  const bodyCellHeight = props.options?.bodyCellHeight ?? 52;
  const headerCellHeight = props.options?.headerCellHeight ?? 24;

  switch(props.scale) {
    case 'year':
      return {
        groupCellWidth: 0,
        cellWidth: cellWidth * 8,
        headerCellHeight: headerCellHeight * 2,
        bodyCellHeight,
      };
    case 'year/month':
      return {
        groupCellWidth: cellWidth * 3 * 12,
        cellWidth: cellWidth * 3,
        headerCellHeight,
        bodyCellHeight,
      };
    default:
      return {
        groupCellWidth: cellWidth * (props.withoutWeekends ? 5 : 7),
        cellWidth,
        headerCellHeight,
        bodyCellHeight,
      };
  }
});

const minCellWidth = computed(() => props.options?.cellWidth ?? 28);

const setTodayLinePosition = (dates: string[], cellIndex: number): void => {
  if (dates.length === 2) {
    const today = currentDateTime.toISODate();
    const dateArray = getDateInterval(dates[0], dates[1]);
    const index = dateArray.findIndex((date) => date === today);

    if (index !== -1) {
      const left = (sizes.value.cellWidth / 100) * (index / (dateArray.length - 1) * 100);
      if (todayLineCoord.value === null) {
        todayLineCoord.value = left + (cellIndex * sizes.value.cellWidth);
      }
    }
  }
  if (todayLineCoord.value === null) {
    todayLineCoord.value = cellIndex * sizes.value.cellWidth;
  }
};

const onTaskSelect = (id: string): void => {
  const selectedTasksSet = new Set(selectedTaskIds.value);
  if (selectedTasksSet.has(id)) {
    selectedTasksSet.delete(id);
  } else {
    selectedTasksSet.add(id);
  }
  selectedTaskIds.value = [...selectedTasksSet];
  emit('select-task', selectedTaskIds.value)
};

const onOpenSidebarTask = (id: string): void => {
  if (openedTaskIds.value.includes(id)) {
    openedTaskIds.value = openedTaskIds.value.filter(id => id !== id);
  } else {
    openedTaskIds.value.push(id);
  }
};

const syncSelectedTasks = (tasks: GanttTask[]): void => {
  const selectedTasksSet = new Set(selectedTaskIds.value);
  selectedTaskIds.value.forEach((id) => {
    if (!tasks.some((task) => task.id === id)) {
      selectedTasksSet.delete(id);
    }
  });
  selectedTaskIds.value = [...selectedTasksSet];
  emit('select-task', selectedTaskIds.value);
};

watch(() => props.tasks, (newVal) => {
  todayLineCoord.value = null;
  renderKeys.task += 1;
  syncSelectedTasks(newVal);
}, { deep: true });
</script>

<template>
  <div>
    Hello!
  </div>
</template>
