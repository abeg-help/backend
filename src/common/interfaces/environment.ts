export interface IEnvironment {
  APP: {
    NAME?: string;
    PORT: string | number;
    ENV?: string;
    AUTH_EMAIL?: string;
    AUTH_PASS?: string;
  };
  DB: {
    URL: string;
  };
}
