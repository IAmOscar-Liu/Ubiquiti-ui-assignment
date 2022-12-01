export interface Account {
  id: number;
  name: string;
  email: string;
  password?: string;
}

export interface Task {
  id: number;
  name: string;
  description: string;
  price: number;
  completed: boolean;
  deadline: number;
  createdBy: number;
  createdByUsername?: string;
  createdAt?: any;
  updateAt?: any;
  subTasks?: SubTask[];
  taskTotalPrice?: number;
}

export interface SubTask {
  id: number;
  rootTask: number;
  subTaskPath: string;
  name: string;
  description: string;
  price: number;
  children?: SubTask[];
  childrenTotal?: number;
}

export interface Food {
  id: number;
  name: string;
  carbs: number;
  fats: number;
  protein: number;
  img?: string;
  createdBy: number;
  createdByUsername?: string;
  createdAt?: any;
  updateAt?: any;
}