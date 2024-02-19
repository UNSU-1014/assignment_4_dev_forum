export interface ICreateUserPayload {
  email: string;
  password: string;
  nickname?: string;
  name?: string;
  gender?: string;
  age?: number;
}

export interface IUpdateUserPayload {
  email?: string;
  nickname?: string;
  name?: string;
  gender?: string;
  age?: number;
}
