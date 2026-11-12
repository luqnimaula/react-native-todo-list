import { PaginationParams } from "@/types/pagination";
import {
  CreateTodoPayload,
  DeleteTodoResponse,
  TodoItem,
  TodosResponse,
  UpdateTodoPayload,
} from "@/types/todos";
import api from "@/utils/api";

export const fetchTodos = async ({ limit, skip }: PaginationParams) => {
  const response = await api.get<TodosResponse>("/todos", {
    params: { limit, skip },
  });
  return response.data;
};

export const createTodo = async (payload: CreateTodoPayload) => {
  const response = await api.post<TodoItem>("/todos/add", payload);
  return response.data;
};

export const updateTodo = async (id: number, payload: UpdateTodoPayload) => {
  const response = await api.patch<TodoItem>(`/todos/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id: number) => {
  const response = await api.delete<DeleteTodoResponse>(`/todos/${id}`);
  return response.data;
};
