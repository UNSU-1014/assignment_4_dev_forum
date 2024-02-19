export interface IUser {
  id: number;
  email: string;
  encryptedPassword?: string;
  profile?: IUserProfile;
  createdAt: Date;
}

export interface IUserProfile {
  id: number;
  nickname?: string;
  name?: string;
  gender?: string;
  age?: number;
  phoneNumber?: string;
  address?: string;
  userId: number;
}
