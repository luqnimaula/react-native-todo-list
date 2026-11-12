import { PaginationParams } from "@/types/pagination";
import { TodosResponse } from "@/types/todos";
import api from "@/utils/api";

export const fetchTodos = async ({ limit, skip }: PaginationParams) => {
  const response = await api.get<TodosResponse>("/todos", {
    params: { limit, skip },
  });
  return response.data;
};
