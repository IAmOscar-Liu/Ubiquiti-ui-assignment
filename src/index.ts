import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import { AccountController } from "./controller/account/AccountController";
import { FoodController } from "./controller/food/FoodController";
import { TaskController } from "./controller/task/TaskController";
import { handleRefreshToken } from "./utils/handleRefreshToken";
import { isAuth } from "./utils/isAuth";

const app = express();

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? [
            process.env.CORS_ORIGIN,
            process.env.CORS_ORIGIN.split("://").join("://www."),
          ]
        : process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// refresh token
app.post("/api/refresh_token", handleRefreshToken);

// auth
app.post("/api/auth/login", AccountController.instance.login);
app.post("/api/auth/register", AccountController.instance.register);
app.post("/api/auth/logout", AccountController.instance.logout);
app.post("/api/auth/me", AccountController.instance.me);

// task
app.get("/api/tasks", TaskController.instance.getAllTasks);
app.get("/api/task/:id", TaskController.instance.getTask);
app.post("/api/task", isAuth, TaskController.instance.addTask);
app.put("/api/task", isAuth, TaskController.instance.updateTask);
app.delete("/api/task", isAuth, TaskController.instance.deleteTask);

// subtask
app.post("/api/subtask", isAuth, TaskController.instance.addSubTask);
app.put("/api/subtask", isAuth, TaskController.instance.updateSubTask);
app.delete("/api/subtask", isAuth, TaskController.instance.deleteSubTask);

// food
app.get("/api/foods", FoodController.instance.getAllFoods);
app.get("/api/food/:id", FoodController.instance.getFood);
app.post("/api/food", isAuth, FoodController.instance.addFood);
app.put("/api/food", isAuth, FoodController.instance.updateFood);
app.delete("/api/food", isAuth, FoodController.instance.deleteFood);

// Handle production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(__dirname + "/public/"));

  // Handle SPA
  app.get(/.*/, (_, res) => res.sendFile(__dirname + "/public/index.html"));
}

app.listen(process.env.SERVER_PORT, () =>
  console.log(`Server is running on port ${process.env.SERVER_PORT}`)
);
