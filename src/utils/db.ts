import mysql from "mysql2/promise";

export default class DB {
  private static pool: mysql.Pool | undefined;

  static createPool() {
    if (!DB.pool) {
      console.log("Create a new db pool");
      DB.pool = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        port: Number(process.env.DATABASE_PORT || 3306),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
  }

  static getPool() {
    if (!DB.pool) DB.createPool();

    return DB.pool!;
  }
}
