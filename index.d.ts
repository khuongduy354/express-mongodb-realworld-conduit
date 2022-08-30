//extends request namespace
declare namespace Express {
  export interface Request {
    username?: string;
    token?: string;
  }
}
