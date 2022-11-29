import { Request, Response } from "express";
import { TaskModal } from "../../model/task/TaskModal";
import { TaskControllerInterface } from "./TaskControllerInterface";

export class TaskController implements TaskControllerInterface {
  static instance: TaskController = new TaskController();

  async getAllTasks(_: Request, res: Response) {
    try {
      const tasks = await TaskModal.instance.findAllTasks();

      return res.json({ tasks });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async getTask(req: Request, res: Response) {
    const { id } = req.params;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const task = await TaskModal.instance.findTaskById(Number(id));

      return res.json({ task });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addTask(req: Request, res: Response) {
    const { name, description, price, deadline, createdBy, subTasks } =
      req.body;

    try {
      const task_id = await TaskModal.instance.addTask(
        name + "",
        description + "",
        Number(price),
        Number(deadline),
        Number(createdBy)
      );

      if (subTasks && Array.isArray(subTasks) && subTasks.length > 0) {
        for (let subTask of subTasks) {
          if (
            !subTask.name ||
            !subTask.description ||
            subTask.price === undefined
          )
            continue;

          await TaskModal.instance.addSubTask(
            task_id,
            "task:" + task_id,
            subTask.name + "",
            subTask.description + "",
            Number(subTask.price)
          );
        }
      }

      return res.json({ ok: true, id: task_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async addSubTask(req: Request, res: Response) {
    const { rootTask, subTaskPath, name, description, price } = req.body;
    if (
      !rootTask ||
      !subTaskPath ||
      !name ||
      !description ||
      price === undefined
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      const subTask_id = await TaskModal.instance.addSubTask(
        Number(rootTask),
        subTaskPath + "",
        name + "",
        description + "",
        Number(price)
      );

      return res.json({ ok: true, id: subTask_id });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateTask(req: Request, res: Response) {
    const { id, name, description, price, deadline, completed } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if (
      [name, description, price, deadline, completed].every(
        (e) => e === undefined
      )
    )
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await TaskModal.instance.updateTask(
        Number(id),
        name === undefined ? undefined : name + "",
        description === undefined ? undefined : description + "",
        price === undefined ? undefined : Number(price),
        deadline === undefined ? undefined : Number(deadline),
        completed === undefined ? undefined : Boolean(completed)
      );

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async updateSubTask(req: Request, res: Response) {
    const { id, name, description, price } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });
    if ([name, description, price].every((e) => e === undefined))
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await TaskModal.instance.updateSubTask(
        Number(id),
        name === undefined ? undefined : name + "",
        description === undefined ? undefined : description + "",
        price === undefined ? undefined : Number(price)
      );

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await TaskModal.instance.deleteTask(Number(id));

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }

  async deleteSubTask(req: Request, res: Response) {
    const { id } = req.body;
    if (id === undefined)
      return res.status(400).json({ ok: false, errMessage: "Invalid input" });

    try {
      await TaskModal.instance.deleteSubTask(Number(id));

      return res.json({ ok: true, id: Number(id) });
    } catch (error) {
      return res.status(500).json({ ok: false, errMessage: error.message });
    }
  }
}
