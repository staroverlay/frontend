export default interface IUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: "user" | "admin";
}
