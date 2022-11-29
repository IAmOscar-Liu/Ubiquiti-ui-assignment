import { Response, Request } from "express";

export interface TaskControllerInterface {
  getAllTasks: (req: Request, res: Response) => any;
  getTask: (req: Request, res: Response) => any;
  addTask: (req: Request, res: Response) => any;
  addSubTask: (req: Request, res: Response) => any;
  updateTask: (req: Request, res: Response) => any;
  updateSubTask: (req: Request, res: Response) => any;
  deleteTask: (req: Request, res: Response) => any;
  deleteSubTask: (req: Request, res: Response) => any;
}
