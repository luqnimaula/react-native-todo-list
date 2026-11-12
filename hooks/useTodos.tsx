import { fetchTodos } from "@/services/todos";
import { AppError } from "@/types/error";
import { PaginationState } from "@/types/pagination";
import { TodoItem } from "@/types/todos";
import { getError } from "@/utils/error";
import { useCallback, useRef, useState } from "react";

const PAGE_SIZE = 20;

// "initial" = first load / retry, "refresh" = pull-to-refresh, "more" = next page
type FetchMode = "initial" | "refresh" | "more";

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

  // Refs (not state) so the checks below see the latest value immediately,
  // even when onEndReached fires several times in the same frame.
  const isRequestInFlight = useRef(false);
  const nextSkip = useRef(0);

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

  const hasMore = records.length < pagination.total;

  const refetch = useCallback(() => requestPage("initial"), [requestPage]);
  const refresh = useCallback(() => requestPage("refresh"), [requestPage]);
  const loadMore = useCallback(() => {
    if (hasMore) requestPage("more");
  }, [hasMore, requestPage]);

  return {
    records,
    pagination,
    hasMore,
    error,
    loadMoreError,
    isLoading: fetchMode === "initial",
    isRefreshing: fetchMode === "refresh",
    isLoadingMore: fetchMode === "more",
    refetch,
    refresh,
    loadMore,
  };
};
