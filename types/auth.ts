export type AuthLoginPayload = {
  username: string;
  password: string;
};

export type AuthLoginResponse = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
};
