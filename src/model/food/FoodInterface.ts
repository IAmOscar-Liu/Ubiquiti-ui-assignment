import { Food as FoodType } from "../../types";

export interface FoodInterface {
  findAllFoods: () => Promise<FoodType[]>;

  findFoodById: (id: number) => Promise<FoodType | null>;

  //   name: string;
  //   carbs: number;
  //   fats: number;
  //   protein: number;
  //   img?: string;

  addFood: (
    name: string,
    carbs: number,
    fats: number,
    protein: number,
    img: string | undefined,
    createdBy: number
  ) => Promise<number>;

  updateFood: (
    id: number,
    name: string | undefined,
    carbs: number | undefined,
    fats: number | undefined,
    protein: number | undefined,
    img: string | undefined
  ) => Promise<number>;

  deleteFood: (id: number) => Promise<number>;
}
