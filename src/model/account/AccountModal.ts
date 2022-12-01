import { AccountInterface } from "./AccountInterface";
import { Account as AccountType } from "../../types";
import DB from "../../utils/db";

export class AccountModal implements AccountInterface {
  static instance: AccountModal = new AccountModal();

  async findUserByEmail(email: string) {
    const pool = DB.getPool();
    const [rows] = await pool.execute(
      `SELECT id, name, email, password FROM Account WHERE email = ?`,
      [email]
    );

    return (rows as AccountType[])[0] || null;
  }

  async findUserById(id: number) {
    const pool = DB.getPool();
    const [rows] = await pool.execute(
      `SELECT id, name, email FROM Account WHERE id = ?`,
      [id + ""]
    );

    return (rows as AccountType[])[0] || null;
  }

  async addUser(name: string, hashedPassword: string, email: string) {
    const pool = DB.getPool();
    const poolTransaction = await pool.getConnection();
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

      const [rows] = await pool.execute(
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
