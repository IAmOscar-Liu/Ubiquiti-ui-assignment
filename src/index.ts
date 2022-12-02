import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import { AccountController } from "./controller/account/AccountController";
import { FoodController } from "./controller/food/FoodController";
import { TaskController } from "./controller/task/TaskController";
import { handleRefreshToken } from "./utils/handleRefreshToken";
import { isAuth } from "./utils/isAuth";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

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
app.post("/api/refresh_token", (req, res) =>
  handleRefreshToken(req, res, pool)
);

// auth
const account = AccountController.instance;
app.post("/api/auth/login", (req, res) => account.login(req, res, pool));
app.post("/api/auth/register", (req, res) => account.register(req, res, pool));
app.post("/api/auth/logout", (req, res) => account.logout(req, res, pool));
app.post("/api/auth/me", (req, res) => account.me(req, res, pool));

// task
const task = TaskController.instance;
app.get("/api/tasks", (req, res) => task.getAllTasks(req, res, pool));
app.get("/api/task/:id", (req, res) => task.getTask(req, res, pool));
app.post("/api/task", isAuth, (req, res) => task.addTask(req, res, pool));
app.put("/api/task", isAuth, (req, res) => task.updateTask(req, res, pool));
app.delete("/api/task", isAuth, (req, res) => task.deleteTask(req, res, pool));

// subtask
app.post("/api/subtask", isAuth, (req, res) => task.addSubTask(req, res, pool));
app.put("/api/subtask", isAuth, (req, res) =>
  task.updateSubTask(req, res, pool)
);
app.delete("/api/subtask", isAuth, (req, res) =>
  task.deleteSubTask(req, res, pool)
);

// food
const food = FoodController.instance;
app.get("/api/foods", (req, res) => food.getAllFoods(req, res, pool));
app.get("/api/food/:id", (req, res) => food.getFood(req, res, pool));
app.post("/api/food", isAuth, (req, res) => food.addFood(req, res, pool));
app.put("/api/food", isAuth, (req, res) => food.updateFood(req, res, pool));
app.delete("/api/food", isAuth, (req, res) => food.deleteFood(req, res, pool));

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
