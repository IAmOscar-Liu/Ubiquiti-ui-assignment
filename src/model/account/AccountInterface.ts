import { Account as AccountType } from "../../types";

export interface AccountInterface {
  findUserByEmail: (email: string) => Promise<AccountType | null>;

  findUserById: (id: number) => Promise<AccountType | null>;

  addUser: (
    name: string,
    password: string,
    email: string
  ) => Promise<AccountType | null>;
}
