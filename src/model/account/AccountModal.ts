import { AccountInterface } from "./AccountInterface";
import { Account as AccountType } from "../../types";
import mysql from "mysql2/promise";

export class AccountModal implements AccountInterface {
  static instance: AccountModal = new AccountModal();

  private pool: mysql.Pool;

  static initPool(pool: mysql.Pool) {
    AccountModal.instance.pool = pool;
  }

  async findUserByEmail({ email }: { email: string }) {
    const [rows] = await this.pool.execute(
      `SELECT id, name, email, password FROM Account WHERE email = ?`,
      [email]
    );

    return (rows as AccountType[])[0] || null;
  }

  async findUserById({ id }: { id: number }) {
    const [rows] = await this.pool.execute(
      `SELECT id, name, email FROM Account WHERE id = ?`,
      [id + ""]
    );

    return (rows as AccountType[])[0] || null;
  }

  async addUser({
    name,
    password: hashedPassword,
    email,
  }: {
    name: string;
    password: string;
    email: string;
  }) {
    const poolTransaction = await this.pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `
        INSERT INTO 
          Account(name, email, password)
        VALUES (?, ?, ?)  
      `,
        [name, email, hashedPassword]
      );

      await poolTransaction.commit();

      const [rows] = await this.pool.execute(
        `SELECT id, name, email, password FROM Account WHERE email = ?`,
        [email]
      );

      return (rows as AccountType[])[0] || null;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }
}
