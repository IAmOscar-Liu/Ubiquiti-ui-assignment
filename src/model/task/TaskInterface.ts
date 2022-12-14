import { Task as TaskType, SubTask as SubTaskType } from "../../types";

export interface TaskInterface {
  findAllTasks: () => Promise<TaskType[]>;

  findTaskById: (data: { id: number }) => Promise<TaskType | null>;

  findAllSubTasks: (data: { ids: number[] }) => Promise<SubTaskType[]>;

  addTask: (data: {
    name: string;
    description: string;
    price: number;
    deadline: number;
    createdBy: number;
  }) => Promise<number>;

  addSubTask: (data: {
    rootTask: number;
    subTaskPath: string;
    name: string;
    description: string;
    price: number;
  }) => Promise<number>;

  updateTask: (data: {
    id: number;
    name: string | undefined;
    description: string | undefined;
    price: number | undefined;
    deadline: number | undefined;
    completed: boolean | undefined;
  }) => Promise<number>;

  updateSubTask: (data: {
    id: number;
    name: string | undefined;
    description: string | undefined;
    price: number | undefined;
  }) => Promise<number>;

  deleteTask: (data: { id: number }) => Promise<number>;

  deleteSubTask: (data: { id: number }) => Promise<number>;
}
