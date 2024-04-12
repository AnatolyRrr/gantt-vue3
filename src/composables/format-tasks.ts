import { computed, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import { DateTime } from 'luxon';
import type { GanttHover, GanttTask, GanttView, SidebarUser } from '@/library/vue-gantt/vue-gantt.types'

interface IUseFormatTasksData {
  openedTaskIds: Ref<string[]>;
  openedTasks: ComputedRef<(GanttTask | SidebarUser)[]>
  hovers: ComputedRef<GanttHover[]>;
}

export const useFormatTasks = (
  tasks: ComputedRef<GanttTask[]>,
  view: ComputedRef<GanttView>
): IUseFormatTasksData => {
  const openedTaskIds = ref<string[]>([]);
  const exclusionTaskIdsSet = ref<Set<string>>(new Set());

  const getTasksWithSubtasks = (allTasks: GanttTask[], iteratedTasks: GanttTask[]): GanttTask[] => {
    const copiedIteratedTasks: GanttTask[] = JSON.parse(JSON.stringify(iteratedTasks));
    return copiedIteratedTasks.flatMap((task) => {
      task.subtasks = [];
      task.isUser = false;
      if (task.subtaskIds.length) {
        task.subtasks = allTasks.filter((item) => task.subtaskIds.includes(item.id));
        task.subtasks.forEach((subtask) => exclusionTaskIdsSet.value.add(subtask.id));
        task.subtasks = getTasksWithSubtasks(allTasks, task.subtasks);
      }
      return task;
    });
  };

  const getOpenedTasks = (items: GanttTask[] | SidebarUser[]): Array<GanttTask | SidebarUser> => (
    items.flatMap((item) => {
      if (item.subtasks?.length && openedTaskIds.value.includes(item.id)) {
        return [item, ...getOpenedTasks(item.subtasks)];
      }
      return item;
    })
  );

  const tasksWithSubtasks = computed(() => {
    if (view.value === 'tasks') {
      exclusionTaskIdsSet.value.clear();

      const allTasksWithSubtasks = getTasksWithSubtasks(tasks.value, tasks.value);
      const exclusionTaskIds = [...exclusionTaskIdsSet.value];
      return allTasksWithSubtasks.filter((task) => !exclusionTaskIds.includes(task.id));
    }

    const ganttUsers: SidebarUser[] = [];

    tasks.value.forEach((task) => {
      if (!task.users.length) {
        if (ganttUsers[0]?.id === 'emptyId') {
          ganttUsers[0].subTasks.push(task);
        }
        else {
          ganttUsers.unshift({
            id: 'emptyId',
            userId: 'emptyId',
            name: 'Не назначено',
            subtasks: [task],
            isUser: true,
          });
        }
      }
      else {
        task.executors.forEach((executor) => {
          const userId = `user${executor.id}`;
          const foundUserIndex = ganttUsers.findIndex((item) => item.userId === userId);
          if (foundUserIndex === -1) {
            ganttUsers.push({
              ...executor,
              userId,
              isUser: true,
              subtasks: [task],
            });
          }
          else {
            ganttUsers[foundUserIndex].subtasks.push(task);
          }
        });
      }
    });

    ganttUsers.forEach((user) => {
      exclusionTaskIdsSet.value.clear();
      user.subtasks = getTasksWithSubtasks(user.subtasks, user.subtasks);
      const exclusionTaskIds = [...exclusionTaskIdsSet.value];
      user.subtasks = user.subtasks.filter((task) => !exclusionTaskIds.includes(task.id));
    });

    return ganttUsers;
  });

  const openedTasks = computed(() => {
    if (openedTaskIds.value.length) {
      return getOpenedTasks(tasksWithSubtasks.value);
    }
    return tasksWithSubtasks.value;
  });

  const openedTasksHovers = computed(() => {
    const hovers: GanttHover[] = [];
    const usersIndex: number[] = [];

    openedTasks.value.forEach((task, taskIndex) => {
      // вычисляем главные таски
      if (task.isUser) {
        usersIndex.push(taskIndex);
      }

      if (
        !task.isUser
        && openedTaskIds.value.includes(task.id)
        && !openedTaskIds.value.includes(task.parentTask?.id ?? '')
      ) {
        hovers.push({
          id: task.id,
          color: task.status.color,
          startRowIndex: taskIndex,
          endRowIndex: taskIndex,
          startDate: task.startDate
            ? DateTime.fromISO(task.startDate).toISODate() as string
            : '', // пока не найдется дата меньше
          endDate: task.endDate
            ? DateTime.fromISO(task.endDate).toISODate() as string
            : '', // пока не найдется дата больше
          openedSubtaskIds: [], // сюда класть айди сабтасок, которые тоже открыты
          // координаты и размеры ховера в сетке
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          index: taskIndex,
        });
      }

      // вычисляем дочерние таски
      if (task.parentTask) {
        const foundHover = hovers.find((hover) => {
          if (usersIndex.length && hover.index < usersIndex[usersIndex.length - 1]) {
            return false;
          }
          return hover.id === task.parentTask.id
            || hover.openedSubtaskIds.includes(task.parentTask.id);
        });

        if (foundHover) {
          foundHover.endRowIndex = taskIndex;

          if (openedTaskIds.value.includes(task.id)) {
            foundHover.openedSubtaskIds.push(task.id);
          }

          const subtaskStartDate = task.startDate
            ? DateTime.fromISO(task.startDate as string).toISODate() as string
            : '';
          const subtaskEndDate = task.endDate
            ? DateTime.fromISO(task.endDate as string).toISODate() as string
            : '';

          if (
            subtaskStartDate.length
            && (
              !foundHover.startDate.length
              || foundHover.startDate > subtaskStartDate
            )
          ) {
            foundHover.startDate = subtaskStartDate;
          }

          if (
            subtaskEndDate.length
            && (
              !foundHover.endDate.length
              || foundHover.endDate < subtaskEndDate
            )
          ) {
            foundHover.endDate = subtaskEndDate;
          }
        }
      }
    });
    return hovers;
  });

  return {
    openedTaskIds,
    openedTasks,
    hovers: openedTasksHovers,
  }
}
