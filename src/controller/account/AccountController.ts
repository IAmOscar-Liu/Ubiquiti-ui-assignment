import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { AccountModal } from "../../model/account/AccountModal";
import { createTokens } from "../../utils/createTokens";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import { AccountControllerInterface } from "./AccountControllerInterface";

export class AccountController implements AccountControllerInterface {
  static instance: AccountController = new AccountController();

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ ok: false, errorMsg: "Invalid input" });

    // handle database
    try {
      const account = await AccountModal.instance.findUserByEmail(email + "");
      if (!account)
        return res
          .status(400)
          .json({ ok: false, errorMsg: "Wrong email or password" });

      const valid = await bcrypt.compare(password + "", account.password!);
      if (!valid)
        return res
          .status(400)
          .json({ ok: false, errorMsg: "Wrong email or password" });

      const tokens = createTokens(account.id);
      sendRefreshToken(res, tokens.refresh_token);

      delete account.password;

      return res.json({
        account,
        accessToken: tokens.access_token,
      });
    } catch (error) {
      return res.status(500).json({ ok: false, errorMsg: error.message });
    }
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ ok: false, errorMsg: "Invalid input" });

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const account = await AccountModal.instance.addUser(
        name + "",
        hashedPassword,
        email + ""
      );

      const tokens = createTokens(account.id);
      sendRefreshToken(res, tokens.refresh_token);

      delete account.password;

      return res.json({
        account,
        accessToken: tokens.access_token,
      });
    } catch (error) {
      return res.status(500).json({ ok: false, errorMsg: error.message });
    }
  }

  logout(_: Request, res: Response) {
    res.clearCookie("todoapp_refresh_token");

    return res.json({ ok: true });
  }
}
