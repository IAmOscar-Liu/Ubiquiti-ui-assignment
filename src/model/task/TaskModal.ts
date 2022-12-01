import { modifyTask } from "../../utils/modifyTask";
import { pool } from "../../utils/getDBPool";
import { TaskInterface } from "./TaskInterface";
import { Task as TaskType, SubTask as SubTaskType } from "../../types";
import { arrangeSubTask } from "../../utils/arrangeSubTask";
import { ResultSetHeader } from "mysql2";
import { calcTaskTotalPrice } from "../../utils/calcTaskTotalPrice";

export class TaskModal implements TaskInterface {
  static instance: TaskModal = new TaskModal();

  async findAllTasks() {
    const [rows] = await pool.query(
      `
        SELECT 
            t.id,
            t.name,
            t.description,
            t.price,
            t.completed,
            t.deadline,
            t.createdBy,
            t.createdAt,
            t.updateAt,
            a.name AS createdByUsername
        FROM
            Task AS t
                JOIN
            Account AS a ON t.createdBy = a.id
        ORDER BY t.id DESC
      `
    );

    const results: TaskType[] = (rows as any[]).map((r) => modifyTask(r));

    const allSubTasks = await TaskModal.instance.findAllSubTasks(
      results.map((r) => r.id)
    );

    results.forEach((r) => {
      r.subTasks = allSubTasks.filter((s) => s.rootTask === r.id);
      if (r.subTasks && r.subTasks.length > 0)
        r.subTasks = arrangeSubTask(r.subTasks);
    
      r.taskTotalPrice = calcTaskTotalPrice(r);
    });

    return results;
  }

  async findTaskById(id: number) {
    const [rows] = await pool.execute(
      `
        SELECT 
            t.id,
            t.name,
            t.description,
            t.price,
            t.completed,
            t.deadline,
            t.createdBy,
            t.createdAt,
            t.updateAt,
            a.name AS createdByUsername
        FROM
            Task AS t
                JOIN
            Account AS a ON t.createdBy = a.id
        WHERE t.id = ?  
    `,
      [id + ""]
    );

    const task = (rows as any[])[0];
    if (!task) return null;

    const result = modifyTask(task);
    const allSubTasks = await TaskModal.instance.findAllSubTasks([result.id]);
    result.subTasks = allSubTasks;

    if (result.subTasks && result.subTasks.length > 0)
      result.subTasks = arrangeSubTask(result.subTasks);

    result.taskTotalPrice = calcTaskTotalPrice(result);  
    return result;
  }

  async findAllSubTasks(ids: number[]) {
    const [rows] = await pool.query(`
      SELECT
          id,
          rootTask,
          subTaskPath,
          name,
          description,
          price 
      FROM SubTask
      WHERE rootTask IN (${ids.join(",")})        
        `);

    return rows as SubTaskType[];
  }

  async addTask(
    name: string,
    description: string,
    price: number,
    deadline: number,
    createdBy: number
  ) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      const [rows] = await poolTransaction.execute(
        `
      INSERT INTO
          Task(name, description, price, deadline, createdBy)
      VALUES
      (?,?,?,?,?)
     `,
        [name, description, price + "", deadline + "", createdBy + ""]
      );

      await poolTransaction.commit();

      return (rows as ResultSetHeader).insertId;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async addSubTask(
    rootTask: number,
    subTaskPath: string,
    name: string,
    description: string,
    price: number
  ) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      const [rows] = await poolTransaction.execute(
        `
      INSERT INTO
          SubTask(rootTask, subTaskPath, name, description, price)
      VALUES
          (?,?,?,?,?)    
    `,
        [rootTask + "", subTaskPath, name, description, price + ""]
      );

      await poolTransaction.commit();

      return (rows as ResultSetHeader).insertId;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async updateTask(
    id: number,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined,
    deadline: number | undefined,
    completed: boolean | undefined
  ) {
    if (
      [name, description, price, deadline, completed].every(
        (up) => up === undefined
      )
    )
      return id;
    const updateArr = [
      { key: "name", value: name },
      { key: "description", value: description },
      { key: "price", value: price },
      { key: "deadline", value: deadline },
      {
        key: "completed",
        value: completed === undefined ? undefined : completed ? 1 : 0,
      },
    ].filter(({ value }) => value !== undefined);

    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `
        UPDATE Task 
        SET ${updateArr
          .map(({ key, value }) => `${key} = "${value}"`)
          .join(",")}
        WHERE id = ?  
    `,
        [id + ""]
      );

      await poolTransaction.commit();

      return id;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async updateSubTask(
    id: number,
    name: string | undefined,
    description: string | undefined,
    price: number | undefined
  ) {
    if ([name, description, price].every((up) => up === undefined)) return id;
    const updateArr = [
      { key: "name", value: name },
      { key: "description", value: description },
      { key: "price", value: price },
    ].filter(({ value }) => value !== undefined);

    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `
        UPDATE SubTask 
        SET ${updateArr
          .map(({ key, value }) => `${key} = "${value}"`)
          .join(",")}
        WHERE id = ?  
    `,
        [id + ""]
      );

      await poolTransaction.commit();

      return id;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async deleteTask(id: number) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `DELETE FROM SubTask WHERE rootTask = ?
      `,
        [id + ""]
      );

      await poolTransaction.execute(
        `DELETE FROM Task WHERE id = ?
      `,
        [id + ""]
      );

      await poolTransaction.commit();

      return id;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async deleteSubTask(id: number) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.query(`
        DELETE FROM SubTask WHERE subTaskPath LIKE "%subTask:${id}%"
      `);

      await poolTransaction.execute(
        `
        DELETE FROM SubTask WHERE id = ?
      `,
        [id + ""]
      );

      await poolTransaction.commit();

      return id;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }
}