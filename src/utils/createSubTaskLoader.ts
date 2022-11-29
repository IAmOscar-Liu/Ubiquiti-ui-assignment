import DataLoader from "dataloader";
import mysql from "mysql2/promise";
import { SubTask } from "../types";

export const createSubTaskLoader = (pool: mysql.Pool) =>
  new DataLoader<number, SubTask[]>(async (task_ids) => {
    const unique_task_ids = Array.from(new Set(task_ids));

    const [rows] = await pool.query(`
        SELECT
            id,
            rootTask,
            subTaskPath,
            name,
            description,
            price 
        FROM SubTask
        WHERE rootTask IN (${unique_task_ids.join(",")})        
        `);

    const allSubTasks = (rows as SubTask[]).map((s) => {
      delete s.children;
      return s;
    });
    //
    return unique_task_ids.map((task_id) =>
      allSubTasks.filter((s) => s.rootTask === task_id)
    );
  });
