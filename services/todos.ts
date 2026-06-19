import { PaginationState } from "@/types/pagination";
import { TodoItem } from "@/types/todos";
import api from "@/utils/api";

export const fetchTodos = async () => {
  try {
    const response = await api.get<PaginationState & { todos: TodoItem[] }>(
      "/todos",
    );
    return response.data;
  } catch (err) {
    return Promise.reject(err);
  }
};
