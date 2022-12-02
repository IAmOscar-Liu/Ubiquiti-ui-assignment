import { Request, Response } from "express";
import { FoodModal } from "../../model/food/FoodModal";
import { FoodControllerInterface } from "./FoodControllerInterface";
import mysql from "mysql2/promise";

export class FoodController implements FoodControllerInterface {
  static instance: FoodController = new FoodController();

  async getAllFoods(_: Request, res: Response, pool: mysql.Pool) {
    try {
      const foods = await FoodModal.instance.findAllFoods(pool);

      return res.json({ foods });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async getFood(req: Request, res: Response, pool: mysql.Pool) {
    const { id } = req.params;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const food = await FoodModal.instance.findFoodById(pool, {
        id: Number(id),
      });

      return res.json({ food });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addFood(req: Request, res: Response, pool: mysql.Pool) {
    const { name, carbs, fats, protein, img, createdBy } = req.body;

    if (
      !name ||
      carbs === undefined ||
      fats === undefined ||
      protein === undefined ||
      createdBy === undefined
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const task_id = await FoodModal.instance.addFood(pool, {
        name: name + "",
        carbs: Number(carbs),
        fats: Number(fats),
        protein: Number(protein),
        img: img ? img + "" : "/imgs/default_img.jpg",
        createdBy: Number(createdBy),
      });

      return res.json({ ok: true, id: task_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateFood(req: Request, res: Response, pool: mysql.Pool) {
    const { id, name, carbs, fats, protein, img } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if ([name, name, carbs, fats, protein, img].every((e) => e === undefined))
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await FoodModal.instance.updateFood(pool, {
        id: Number(id),
        name: name === undefined ? undefined : name + "",
        carbs: carbs === undefined ? undefined : Number(carbs),
        fats: fats === undefined ? undefined : Number(fats),
        protein: protein === undefined ? undefined : Number(protein),
        img: img === undefined ? undefined : img + "",
      });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteFood(req: Request, res: Response, pool: mysql.Pool) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await FoodModal.instance.deleteFood(pool, { id: Number(id) });

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }
}
