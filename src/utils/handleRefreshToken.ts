import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { createTokens } from "./createTokens";
import DB from "./db";
import { sendRefreshToken } from "./sendRefreshToken";

export const handleRefreshToken = async (req: Request, res: Response) => {
  const refresh_token = req.cookies["todoapp_refresh_token"];

  if (!refresh_token) {
    return res.status(401).send({
      ok: false,
      errorMessage: "Refresh token doesn't exist",
    });
  }

  let account_id_from_cookie: number;
  try {
    const payload: any = verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET
    );
    account_id_from_cookie = Number(payload.account_id);

    if (!account_id_from_cookie)
      return res.status(401).send({
        ok: false,
        errorMessage: "Invalid refresh token",
      });
  } catch (error) {
    console.log("refresh token error - ", error);
    return res.status(401).json({
      ok: false,
      errorMessage: "Invalid refresh token",
    });
  }

  // find user by userId stored in token
  const pool = DB.getPool();
  const [userRows] = await pool.execute(`SELECT id FROM Account WHERE id = ?`, [
    account_id_from_cookie,
  ]);
  const account_id = (userRows as { id: number }[])[0]?.id;

  if (!account_id) {
    return res
      .status(401)
      .json({ ok: false, errorMessage: "Cannot find account" });
  }

  const tokens = createTokens(account_id);

  sendRefreshToken(res, refresh_token);
  return res.json({ ok: true, access_token: tokens.access_token });
};
