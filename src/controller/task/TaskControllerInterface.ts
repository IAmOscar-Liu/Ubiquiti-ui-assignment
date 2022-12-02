import { Response, Request } from "express";
import mysql from "mysql2/promise";

export interface TaskControllerInterface {
  getAllTasks: (req: Request, res: Response, pool: mysql.Pool) => any;
  getTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  addTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  addSubTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  updateTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  updateSubTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  deleteTask: (req: Request, res: Response, pool: mysql.Pool) => any;
  deleteSubTask: (req: Request, res: Response, pool: mysql.Pool) => any;
}
