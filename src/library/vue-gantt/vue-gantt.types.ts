export type GanttView = 'tasks' | 'users';
export type GanttScale = 'week/day' | 'year/month' | 'year';
export interface GanttExecutor {
  id: string
  name: string
  [key: string]: any
}
export interface GanttTaskStatus {
  id: string
  name: string
  color: string
  [key: string]: any
}
export interface GanttTask {
  id: string
  name: string
  startDate: string | null // ISO format
  endDate: string | null // ISO format
  status: GanttTaskStatus
  isClose: boolean
  startAfterIds: string[]
  subtaskIds: string[]
  parentTask: GanttTask | null
  executors: GanttExecutor[]
  subtasks?: GanttTask[]
  isUser?: false
  [key: string]: any
}
export interface SidebarUser extends GanttExecutor {
  userId: string
  isUser: true
  subtasks: GanttTask[]
}
export interface GanttOptions {
  cellWidth?: number;
  bodyCellHeight?: number;
  headerCellHeight?: number;
  todayBackgroundColor?: string;
  todayColor?: string;
  weekendColor?: string;
  netColor?: string;
  backgroundColor?: string;
}
export interface GanttProps {
  tasks: GanttTask[];
  statuses: GanttTaskStatus[];
  view?: GanttView;
  scale?: GanttScale;
  showLinks?: boolean;
  showDates?: boolean;
  withoutWeekends?: boolean;
  showNet?: boolean;
  showClosed?: boolean;
  todayTrigger?: boolean;
  creationDate?: string; // ISO format
  rerenderTrigger?: boolean;
  options?: GanttOptions;
}
export interface GanttHover {
  id: string;
  openedSubtaskIds: string[];
  startRowIndex: number;
  endRowIndex: number;
  startDate: string;
  endDate: string;
  color: string;
  top: number;
  left: number;
  width: number;
  height: number;
  index: number;
}
