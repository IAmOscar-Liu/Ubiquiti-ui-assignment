import { verify } from "jsonwebtoken";

export const getAccessTokenFromAuth = (authorization: string | undefined) => {
  if (!authorization) return {};

  const access_token = authorization.split(" ")[1];

  try {
    const account_id = (
      verify(access_token, process.env.ACCESS_TOKEN_SCERET) as any
    ).account_id as number;

    return { account_id, access_token };
  } catch (error) {
    return {};
  }
};
