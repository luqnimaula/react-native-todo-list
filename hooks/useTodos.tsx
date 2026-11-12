import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from "@/services/todos";
import { AppError } from "@/types/error";
import { PaginationState } from "@/types/pagination";
import { TodoItem } from "@/types/todos";
import { getError } from "@/utils/error";
import { useCallback, useRef, useState } from "react";

const PAGE_SIZE = 20;

// "initial" = first load / retry, "refresh" = pull-to-refresh, "more" = next page
type FetchMode = "initial" | "refresh" | "more";

/**
 * DummyJSON doesn't persist writes: every added todo comes back with the same
 * id, and updating/deleting it returns 404. So added todos get a unique
 * negative id and are only changed locally afterwards.
 */
export const isLocalTodo = (todo: TodoItem) => todo.id < 0;

export const useTodos = () => {
  const [fetchMode, setFetchMode] = useState<FetchMode | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [loadMoreError, setLoadMoreError] = useState<AppError | null>(null);
  const [records, setRecords] = useState<TodoItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    limit: 0,
    skip: 0,
    total: 0,
  });
  // Todos with a write request in flight (their row is disabled meanwhile)
  const [pendingIds, setPendingIds] = useState<ReadonlySet<number>>(new Set());

  // Refs (not state) so the checks below see the latest value immediately,
  // even when onEndReached fires several times in the same frame.
  const isRequestInFlight = useRef(false);
  const nextSkip = useRef(0);
  const nextLocalId = useRef(-1);

  const requestPage = useCallback(async (mode: FetchMode) => {
    if (isRequestInFlight.current) return;
    isRequestInFlight.current = true;

    const isNextPage = mode === "more";
    const skip = isNextPage ? nextSkip.current : 0;

    setFetchMode(mode);
    if (isNextPage) {
      setLoadMoreError(null);
    } else {
      setError(null);
    }

    try {
      const { todos, limit, total } = await fetchTodos({
        limit: PAGE_SIZE,
        skip,
      });
      setRecords((prev) => (isNextPage ? [...prev, ...todos] : todos));
      setPagination({ limit, skip, total });
      nextSkip.current = skip + todos.length;
    } catch (err) {
      const appError = getError(err);
      if (isNextPage) {
        setLoadMoreError(appError);
      } else {
        setError(appError);
      }
    } finally {
      isRequestInFlight.current = false;
      setFetchMode(null);
    }
  }, []);

  // Based on the server's paging, not records.length, which changes as
  // todos are added or deleted locally
  const hasMore = pagination.skip + pagination.limit < pagination.total;

  const refetch = useCallback(() => requestPage("initial"), [requestPage]);
  const refresh = useCallback(() => requestPage("refresh"), [requestPage]);
  const loadMore = useCallback(() => {
    if (hasMore) requestPage("more");
  }, [hasMore, requestPage]);

  const setPending = useCallback((id: number, isPending: boolean) => {
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (isPending) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  // Each mutation updates the UI first, then rolls back if the request fails.
  // They resolve with an AppError (or null) instead of throwing.

  const addTodo = useCallback(
    async (text: string, userId: number): Promise<AppError | null> => {
      const localTodo: TodoItem = {
        id: nextLocalId.current--,
        todo: text,
        completed: false,
        userId,
      };
      setRecords((prev) => [localTodo, ...prev]);
      setPending(localTodo.id, true);

      try {
        await createTodo({ todo: text, completed: false, userId });
        return null;
      } catch (err) {
        setRecords((prev) => prev.filter((t) => t.id !== localTodo.id));
        return getError(err);
      } finally {
        setPending(localTodo.id, false);
      }
    },
    [setPending],
  );

  const toggleTodo = useCallback(
    async (todo: TodoItem): Promise<AppError | null> => {
      const setCompleted = (completed: boolean) =>
        setRecords((prev) =>
          prev.map((t) => (t.id === todo.id ? { ...t, completed } : t)),
        );

      setCompleted(!todo.completed);
      if (isLocalTodo(todo)) return null;

      setPending(todo.id, true);
      try {
        await updateTodo(todo.id, { completed: !todo.completed });
        return null;
      } catch (err) {
        setCompleted(todo.completed);
        return getError(err);
      } finally {
        setPending(todo.id, false);
      }
    },
    [setPending],
  );

  const removeTodo = useCallback(
    async (todo: TodoItem): Promise<AppError | null> => {
      const index = records.findIndex((t) => t.id === todo.id);
      setRecords((prev) => prev.filter((t) => t.id !== todo.id));
      if (isLocalTodo(todo)) return null;

      try {
        await deleteTodo(todo.id);
        return null;
      } catch (err) {
        // Put it back where it was
        setRecords((prev) => {
          const next = [...prev];
          next.splice(Math.min(index, next.length), 0, todo);
          return next;
        });
        return getError(err);
      }
    },
    [records],
  );

  return {
    records,
    pagination,
    hasMore,
    pendingIds,
    error,
    loadMoreError,
    isLoading: fetchMode === "initial",
    isRefreshing: fetchMode === "refresh",
    isLoadingMore: fetchMode === "more",
    refetch,
    refresh,
    loadMore,
    addTodo,
    toggleTodo,
    removeTodo,
  };
};
