import { Food as FoodType } from "../../types";

export interface FoodInterface {
  findAllFoods: () => Promise<FoodType[]>;

  findFoodById: (data: { id: number }) => Promise<FoodType | null>;

  addFood: (data: {
    name: string;
    carbs: number;
    fats: number;
    protein: number;
    img: string | undefined;
    createdBy: number;
  }) => Promise<number>;

  updateFood: (data: {
    id: number;
    name: string | undefined;
    carbs: number | undefined;
    fats: number | undefined;
    protein: number | undefined;
    img: string | undefined;
  }) => Promise<number>;

  deleteFood: (data: { id: number }) => Promise<number>;
}
