import { Account as AccountType } from "../../types";

export interface AccountInterface {
  findUserByEmail: (data: { email: string }) => Promise<AccountType | null>;

  findUserById: (data: { id: number }) => Promise<AccountType | null>;

  addUser: (data: {
    name: string;
    password: string;
    email: string;
  }) => Promise<AccountType | null>;
}
