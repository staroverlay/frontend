import Session from "./session";

export default interface ISessionWithToken extends Session {
  token: string;
}
