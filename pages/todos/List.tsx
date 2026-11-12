import { TodoListItem } from "@/components/todos";
import { AppButton, StateMessage } from "@/components/ui";
import { baseColor, neutralColor } from "@/constants/style";
import { useTodos } from "@/hooks";
import { TodoItem } from "@/types/todos";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const renderItem: ListRenderItem<TodoItem> = ({ item }) => (
  <TodoListItem item={item} />
);

const keyExtractor = (item: TodoItem) => String(item.id);

const ItemSeparator = () => <View style={styles.separator} />;

const List: React.FC = () => {
  const {
    records,
    pagination,
    hasMore,
    error,
    loadMoreError,
    isLoading,
    isRefreshing,
    isLoadingMore,
    refetch,
    refresh,
    loadMore,
  } = useTodos();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Don't auto-retry a failed page on scroll; the footer has a retry button
  const handleEndReached = useCallback(() => {
    if (!loadMoreError) loadMore();
  }, [loadMoreError, loadMore]);

  const isEmpty = records.length === 0;

  if (isEmpty && isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={baseColor.primary} />
      </View>
    );
  }

  if (isEmpty && error) {
    return (
      <View style={styles.screen}>
        <StateMessage
          title="Couldn't load your todos"
          message={error.message}
          actionTitle="Retry"
          onAction={refetch}
        />
      </View>
    );
  }

  const renderHeader = () => (
    <View style={styles.header}>
      {/* A failed pull-to-refresh keeps the old list and shows a banner */}
      {error ? (
        <Text style={styles.errorBanner}>Refresh failed: {error.message}</Text>
      ) : null}
      {!isEmpty ? (
        <Text style={styles.counter}>
          Showing {records.length} of {pagination.total}
        </Text>
      ) : null}
    </View>
  );

  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <ActivityIndicator style={styles.footer} color={baseColor.primary} />
      );
    }
    if (loadMoreError) {
      return (
        <View style={styles.footer}>
          <Text style={styles.footerError}>{loadMoreError.message}</Text>
          <AppButton
            title="Try again"
            variant="secondary"
            size="sm"
            onPress={loadMore}
          />
        </View>
      );
    }
    if (!isEmpty && !hasMore) {
      return <Text style={[styles.footer, styles.counter]}>You&apos;re all caught up</Text>;
    }
    return null;
  };

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 16 },
      ]}
      data={records}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        <StateMessage
          title="No todos yet"
          message="Pull down to refresh."
        />
      }
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refresh}
          colors={[baseColor.primary]}
          tintColor={baseColor.primary}
        />
      }
    />
  );
};

export default List;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: neutralColor.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: neutralColor.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    gap: 8,
  },
  counter: {
    fontSize: 13,
    color: neutralColor.textMuted,
    textAlign: "center",
  },
  errorBanner: {
    fontSize: 13,
    color: baseColor.danger,
    textAlign: "center",
  },
  separator: {
    height: 8,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  footerError: {
    fontSize: 13,
    color: baseColor.danger,
    textAlign: "center",
  },
});
