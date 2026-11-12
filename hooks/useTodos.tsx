import { fetchTodos } from "@/services/todos";
import { AppError } from "@/types/error";
import { PaginationState } from "@/types/pagination";
import { TodoItem } from "@/types/todos";
import { getError } from "@/utils/error";
import { useCallback, useState } from "react";

export const useTodos = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AppError | null>(null);
  const [records, setRecords] = useState<TodoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    limit: 0,
    skip: 0,
    total: 0,
  });

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { todos = [], limit = 0, skip = 0, total = 0 } = await fetchTodos();
      setRecords(todos);
      setPagination({ limit, skip, total });
    } catch (err) {
      setError(getError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    records,
    pagination,
    refetch,
  };
};
