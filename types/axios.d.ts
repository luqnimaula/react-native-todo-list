import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    /** Set once a request has been replayed after a token refresh. */
    _retry?: boolean;
  }
}
