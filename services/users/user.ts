export default interface IUser {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  isCreator: boolean;
  profileId?: string;
  createdAt: string;
  updatedAt: string;
}
