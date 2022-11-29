import { Food as FoodType } from "../types";

export const Food: FoodType[] = [
  {
    id: 1,
    name: "bread",
    carbs: 20,
    fats: 30,
    protein: 40,
    img: "/imgs/bread.jpg",
    createdBy: 1,
  },
  {
    id: 2,
    name: "lettuce",
    carbs: 10,
    fats: 5,
    protein: 5,
    img: "/imgs/lettuce.jpg",
    createdBy: 1,
  },
  {
    id: 3,
    name: "carrot",
    carbs: 15,
    fats: 3,
    protein: 10,
    img: "/imgs/carrot.jpg",
    createdBy: 1,
  },
];
