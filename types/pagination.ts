export type PaginationState = {
  limit: number;
  skip: number;
  total: number;
};

export type PaginationParams = Pick<PaginationState, "limit" | "skip">;
