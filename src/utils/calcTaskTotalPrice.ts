import { SubTask, Task } from "../types";

const calcSubTaskTotalPrice = (subTask: SubTask) => {
  let sum = subTask.price;

  if (!subTask.children) return sum;

  for (let child of subTask.children) {
    sum += calcSubTaskTotalPrice(child);
  }
  return sum;
};

export const calcTaskTotalPrice = (task: Task) => {
  let sum = task.price;

  if (!task.subTasks) return sum;

  for (let subTask of task.subTasks) {
    sum += calcSubTaskTotalPrice(subTask);
  }
  return sum;
};
