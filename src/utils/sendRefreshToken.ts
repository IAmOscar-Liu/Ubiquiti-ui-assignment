import { Response } from "express";

const MAX_AGE = 1000 * 60 * 60 * 24 * 30;

export const sendRefreshToken = (res: Response, refresh_token: string) => {
  res.cookie("todoapp_refresh_token", refresh_token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });
};
