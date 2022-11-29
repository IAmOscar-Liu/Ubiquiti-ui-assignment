import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const isAuth = (
  req: Request & { account_id?: string },
  res: Response,
  next: NextFunction
): any => {
  const authorization = req.headers["authorization"];

  if (!authorization) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const token = authorization.split(" ")[1];
    const payload: any = verify(token, process.env.ACCESS_TOKEN_SCERET);

    req.account_id = payload.account_id;

    next();
  } catch (error) {
    console.log("isAuth Error: ", error);
    res.status(401).json({ msg: "Unauthorized" });
  }
};
