import { Task as TaskType, SubTask as SubTaskType } from "../../types";
import mysql from "mysql2/promise";

export interface TaskInterface {
  findAllTasks: (pool: mysql.Pool) => Promise<TaskType[]>;

  findTaskById: (
    pool: mysql.Pool,
    data: { id: number }
  ) => Promise<TaskType | null>;

  findAllSubTasks: (
    pool: mysql.Pool,
    data: { ids: number[] }
  ) => Promise<SubTaskType[]>;

  addTask: (
    pool: mysql.Pool,
    data: {
      name: string;
      description: string;
      price: number;
      deadline: number;
      createdBy: number;
    }
  ) => Promise<number>;

  addSubTask: (
    pool: mysql.Pool,
    data: {
      rootTask: number;
      subTaskPath: string;
      name: string;
      description: string;
      price: number;
    }
  ) => Promise<number>;

  updateTask: (
    pool: mysql.Pool,
    data: {
      id: number;
      name: string | undefined;
      description: string | undefined;
      price: number | undefined;
      deadline: number | undefined;
      completed: boolean | undefined;
    }
  ) => Promise<number>;

  updateSubTask: (
    pool: mysql.Pool,
    data: {
      id: number;
      name: string | undefined;
      description: string | undefined;
      price: number | undefined;
    }
  ) => Promise<number>;

  deleteTask: (pool: mysql.Pool, data: { id: number }) => Promise<number>;

  deleteSubTask: (pool: mysql.Pool, data: { id: number }) => Promise<number>;
}
