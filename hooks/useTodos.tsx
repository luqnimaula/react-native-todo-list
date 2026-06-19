import { fetchTodos } from "@/services/todos";
import { PaginationState } from "@/types/pagination";
import { TodoItem } from "@/types/todos";
import { getError } from "@/utils/error";
import { useCallback, useState } from "react";

export const useTodos = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [records, setRecords] = useState<TodoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    limit: 0,
    skip: 0,
    total: 0,
  });

  const getTodos = useCallback(async () => {
    try {
      setIsLoading(true);
      const { todos = [], limit = 0, skip = 0, total = 0 } = await fetchTodos();
      setRecords(todos);
      setPagination({ limit, skip, total });
    } catch (err) {
      getError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    records,
    pagination,
    getTodos,
  };
};
