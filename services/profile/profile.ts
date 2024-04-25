export type ProfileRole =
  | 'artist'
  | 'creator'
  | 'early-adopter'
  | 'staff'
  | 'translator';

export default interface Profile {
  _id: string;
  avatar?: string;
  displayName: string;
  roles: ProfileRole[];
}
