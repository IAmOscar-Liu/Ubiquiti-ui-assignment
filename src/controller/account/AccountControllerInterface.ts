import { Response, Request } from "express";
import mysql from "mysql2/promise";

export interface AccountControllerInterface {
  login: (req: Request, res: Response, pool: mysql.Pool) => any;
  register: (req: Request, res: Response, pool: mysql.Pool) => any;
  logout: (req: Request, res: Response, pool: mysql.Pool) => any;
  me: (req: Request, res: Response, pool: mysql.Pool) => any;
}
