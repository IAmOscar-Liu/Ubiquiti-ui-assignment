import { Task as TaskType, SubTask as SubTaskType } from "../../types";

export interface TaskInterface {
  findAllTasks: () => Promise<TaskType[]>;

  findTaskById: (id: number) => Promise<TaskType | null>;

  findAllSubTasks: (ids: number[]) => Promise<SubTaskType[]>;

  addTask: (
    name: string,
    description: string,
    price: number,
    deadline: number,
    createdBy: number
  ) => Promise<number>;

  addSubTask: (
    rootTask: number,
    subTaskPath: string,
    name: string,
    description: string,
    price: number
  ) => Promise<number>;

  updateTask: (
    id: number,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined,
    deadline: number | undefined,
    completed: boolean | undefined
  ) => Promise<number>;

  updateSubTask: (
    id: number,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined
  ) => Promise<number>;

  deleteTask: (id: number) => Promise<number>;

  deleteSubTask: (id: number) => Promise<number>;
}
