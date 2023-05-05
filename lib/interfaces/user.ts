export default interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  role: "user" | "admin";
}
