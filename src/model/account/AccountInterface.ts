import { Account as AccountType } from "../../types";
import mysql from "mysql2/promise";

export interface AccountInterface {
  findUserByEmail: (
    pool: mysql.Pool,
    data: { email: string }
  ) => Promise<AccountType | null>;

  findUserById: (
    pool: mysql.Pool,
    data: { id: number }
  ) => Promise<AccountType | null>;

  addUser: (
    pool: mysql.Pool,
    data: { name: string; password: string; email: string }
  ) => Promise<AccountType | null>;
}
