import { pool } from "../../utils/getDBPool";
import { AccountInterface } from "./AccountInterface";
import { Account as AccountType } from "../../types";

export class AccountModal implements AccountInterface {
  static instance: AccountModal = new AccountModal();

  async findUserByEmail(email: string) {
    const [rows] = await pool.execute(
      `SELECT id, name, email, password FROM Account WHERE email = ?`,
      [email]
    );

    return (rows as AccountType[])[0] || null;
  }

  async addUser(name: string, hashedPassword: string, email: string) {
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
