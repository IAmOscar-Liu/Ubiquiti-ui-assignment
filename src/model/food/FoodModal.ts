import { ResultSetHeader } from "mysql2";
import { Food as FoodType } from "../../types";
import { pool } from "../../utils/getDBPool";
import { FoodInterface } from "./FoodInterface";

export class FoodModal implements FoodInterface {
  static instance: FoodModal = new FoodModal();

  async findAllFoods() {
    const [rows] = await pool.query(
      `
        SELECT 
            f.id,
            f.name,
            f.carbs,
            f.fats,
            f.protein,
            f.img,
            f.createdBy,
            f.createdAt,
            f.updateAt,
            a.name AS createdByUsername
        FROM
            Food AS f
                JOIN
            Account AS a ON f.createdBy = a.id
        ORDER BY f.id DESC  
      `
    );

    return rows as FoodType[];
  }

  async findFoodById(id: number) {
    const [rows] = await pool.execute(
      `
        SELECT 
            f.id,
            f.name,
            f.carbs,
            f.fats,
            f.protein,
            f.img,
            f.createdBy,
            f.createdAt,
            f.updateAt,
            a.name AS createdByUsername
        FROM
            Food AS f
                JOIN
            Account AS a ON f.createdBy = a.id
        WHERE f.id = ?
    `,
      [id + ""]
    );

    const food = (rows as FoodType[])[0];
    return food || null;
  }

  async addFood(
    name: string,
    carbs: number,
    fats: number,
    protein: number,
    img: string | undefined,
    createdBy: number
  ) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      const [rows] = await poolTransaction.execute(
        `
      INSERT INTO
          Food(name, carbs, fats, protein, img, createdBy)
      VALUES
      (?,?,?,?,?,?)
     `,
        [
          name,
          carbs + "",
          fats + "",
          protein + "",
          img ? img + "" : "/imgs/default_img.jpg",
          createdBy + "",
        ]
      );

      await poolTransaction.commit();

      return (rows as ResultSetHeader).insertId;
    } catch (error) {
      await poolTransaction.rollback();
      throw error;
    }
  }

  async updateFood(
    id: number,
    name: string | undefined,
    carbs: number | undefined,
    fats: number | undefined,
    protein: number | undefined,
    img: string | undefined
  ) {
    if ([name, carbs, fats, protein, img].every((up) => up === undefined))
      return id;
    const updateArr = [
      { key: "name", value: name },
      { key: "carbs", value: carbs },
      { key: "fats", value: fats },
      { key: "protein", value: protein },
      {
        key: "img",
        value: img ? img + "" : "/imgs/default_img.jpg",
      },
    ].filter(({ value }) => value !== undefined);

    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `
        UPDATE Food 
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

  async deleteFood(id: number) {
    const poolTransaction = await pool.getConnection();
    await poolTransaction.beginTransaction();

    try {
      await poolTransaction.execute(
        `DELETE FROM Food WHERE id = ?
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
