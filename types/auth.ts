export type AuthLoginPayload = {
  username: string;
  password: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type AuthUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
};

export type AuthLoginResponse = AuthUser & AuthTokens;

export type AuthStatus = "loading" | "signedIn" | "signedOut";
