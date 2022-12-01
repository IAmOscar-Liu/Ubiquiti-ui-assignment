declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: string;
      ACCESS_TOKEN_SCERET: string;
      REFRESH_TOKEN_SECRET: string;
      DATABASE_HOST: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
      DATABASE_PORT: string;
      CORS_ORIGIN: string;
      NODE_ENV: string;
    }
  }
}

export {}
