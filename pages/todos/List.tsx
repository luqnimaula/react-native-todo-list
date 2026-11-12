import { AddTodoForm, TodoListItem } from "@/components/todos";
import { AppButton, StateMessage } from "@/components/ui";
import { baseColor, neutralColor } from "@/constants/style";
import { useAuth, useTodos } from "@/hooks";
import { TodoItem } from "@/types/todos";
import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const keyExtractor = (item: TodoItem) => String(item.id);

const ItemSeparator = () => <View style={styles.separator} />;

const List: React.FC = () => {
  const {
    records,
    hasMore,
    pendingIds,
    error,
    loadMoreError,
    isLoading,
    isRefreshing,
    isLoadingMore,
    refetch,
    refresh,
    loadMore,
    addTodo,
    toggleTodo,
    removeTodo,
  } = useTodos();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Don't auto-retry a failed page on scroll; the footer has a retry button
  const handleEndReached = useCallback(() => {
    if (!loadMoreError) loadMore();
  }, [loadMoreError, loadMore]);

  const handleAdd = useCallback(
    async (text: string) => {
      // DummyJSON requires a userId, which comes from the profile
      if (!user) {
        return { message: "Your profile is still loading. Try again." };
      }
      return addTodo(text, user.id);
    },
    [user, addTodo],
  );

  const handleToggle = useCallback(
    async (item: TodoItem) => {
      const toggleError = await toggleTodo(item);
      if (toggleError) {
        Alert.alert("Couldn't update todo", toggleError.message);
      }
    },
    [toggleTodo],
  );

  const handleDelete = useCallback(
    async (item: TodoItem) => {
      const deleteError = await removeTodo(item);
      if (deleteError) {
        Alert.alert("Couldn't delete todo", deleteError.message);
      }
    },
    [removeTodo],
  );

  const renderItem = useCallback<ListRenderItem<TodoItem>>(
    ({ item }) => (
      <TodoListItem
        item={item}
        isPending={pendingIds.has(item.id)}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    ),
    [pendingIds, handleToggle, handleDelete],
  );

  const isEmpty = records.length === 0;
  const doneCount = records.filter((record) => record.completed).length;

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

  // Passed to FlatList as elements, not inline components, so the add form
  // keeps its text and keyboard focus when the list re-renders
  const header = (
    <View style={styles.header}>
      {user ? (
        <Text style={styles.greeting}>
          Hi, {user.firstName} {user.lastName}
        </Text>
      ) : null}
      <AddTodoForm onSubmit={handleAdd} />
      {/* A failed pull-to-refresh keeps the old list and shows a banner */}
      {error ? (
        <Text style={styles.errorBanner}>Refresh failed: {error.message}</Text>
      ) : null}
      {!isEmpty ? (
        <Text style={styles.counter}>
          {doneCount} of {records.length} done
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
      return (
        <Text style={[styles.footer, styles.counter]}>
          You&apos;re all caught up
        </Text>
      );
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
      ListHeaderComponent={header}
      ListFooterComponent={renderFooter()}
      ListEmptyComponent={
        <StateMessage
          title="No todos yet"
          message="Add one above, or pull down to refresh."
        />
      }
      keyboardShouldPersistTaps="handled"
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
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: neutralColor.text,
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
