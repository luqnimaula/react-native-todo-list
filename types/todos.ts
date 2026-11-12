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

export type CreateTodoPayload = Pick<TodoItem, "todo" | "completed" | "userId">;

export type UpdateTodoPayload = Partial<Pick<TodoItem, "todo" | "completed">>;

export type DeleteTodoResponse = TodoItem & {
  isDeleted: boolean;
  deletedOn: string;
};
