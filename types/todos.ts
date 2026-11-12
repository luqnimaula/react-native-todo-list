import { PaginationState } from "./pagination";

export type TodoItem = {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
};

export type TodosResponse = PaginationState & {
  todos: TodoItem[];
};
