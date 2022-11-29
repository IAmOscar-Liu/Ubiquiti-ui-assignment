import { Response, Request } from "express";

export interface FoodControllerInterface {
  getAllFoods: (req: Request, res: Response) => any;
  getFood: (req: Request, res: Response) => any;
  addFood: (req: Request, res: Response) => any;
  updateFood: (req: Request, res: Response) => any;
  deleteFood: (req: Request, res: Response) => any;
}
