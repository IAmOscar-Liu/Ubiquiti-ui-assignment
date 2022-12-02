import { Food as FoodType } from "../../types";
import mysql from "mysql2/promise";

export interface FoodInterface {
  findAllFoods: (pool: mysql.Pool) => Promise<FoodType[]>;

  findFoodById: (
    pool: mysql.Pool,
    data: {
      id: number;
    }
  ) => Promise<FoodType | null>;

  addFood: (
    pool: mysql.Pool,
    data: {
      name: string;
      carbs: number;
      fats: number;
      protein: number;
      img: string | undefined;
      createdBy: number;
    }
  ) => Promise<number>;

  updateFood: (
    pool: mysql.Pool,
    data: {
      id: number;
      name: string | undefined;
      carbs: number | undefined;
      fats: number | undefined;
      protein: number | undefined;
      img: string | undefined;
    }
  ) => Promise<number>;

  deleteFood: (pool: mysql.Pool, data: { id: number }) => Promise<number>;
}
