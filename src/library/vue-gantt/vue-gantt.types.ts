export interface GanttTaskStatus {
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
  [key: string]: any
}
