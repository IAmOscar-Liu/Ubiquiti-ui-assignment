import { Response, Request } from "express";
import mysql from "mysql2/promise";

export interface FoodControllerInterface {
  getAllFoods: (req: Request, res: Response, pool: mysql.Pool) => any;
  getFood: (req: Request, res: Response, pool: mysql.Pool) => any;
  addFood: (req: Request, res: Response, pool: mysql.Pool) => any;
  updateFood: (req: Request, res: Response, pool: mysql.Pool) => any;
  deleteFood: (req: Request, res: Response, pool: mysql.Pool) => any;
}
