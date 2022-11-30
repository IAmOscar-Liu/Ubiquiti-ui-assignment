import { Request, Response } from "express";
import { FoodModal } from "../../model/food/FoodModal";
import { FoodControllerInterface } from "./FoodControllerInterface";

export class FoodController implements FoodControllerInterface {
  static instance: FoodController = new FoodController();

  async getAllFoods(_: Request, res: Response) {
    try {
      const foods = await FoodModal.instance.findAllFoods();

      return res.json({ foods });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async getFood(req: Request, res: Response) {
    const { id } = req.params;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const food = await FoodModal.instance.findFoodById(Number(id));

      return res.json({ food });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addFood(req: Request, res: Response) {
    const { name, carbs, fats, protein, img, createdBy } = req.body;

    try {
      const task_id = await FoodModal.instance.addFood(
        name + "",
        Number(carbs),
        Number(fats),
        Number(protein),
        img ? img + "" : "/imgs/default_img.jpg",
        Number(createdBy)
      );

      return res.json({ ok: true, id: task_id });
    } catch (error) {
      console.log("error: ", error);
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateFood(req: Request, res: Response) {
    const { id, name, carbs, fats, protein, img } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if ([name, name, carbs, fats, protein, img].every((e) => e === undefined))
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await FoodModal.instance.updateFood(
        Number(id),
        name === undefined ? undefined : name + "",
        carbs === undefined ? undefined : Number(carbs),
        fats === undefined ? undefined : Number(fats),
        protein === undefined ? undefined : Number(protein),
        img === undefined ? undefined : img + ""
      );

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteFood(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await FoodModal.instance.deleteFood(Number(id));

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }
}
