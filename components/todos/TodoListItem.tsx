import { baseColor, neutralColor } from "@/constants/style";
import { TodoItem } from "@/types/todos";
import Ionicons from "@expo/vector-icons/Ionicons";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: TodoItem;
  isPending: boolean;
  onToggle: (item: TodoItem) => void;
  onDelete: (item: TodoItem) => void;
};

const TodoListItemComponent: React.FC<Props> = ({
  item,
  isPending,
  onToggle,
  onDelete,
}) => {
  return (
    <View style={[styles.container, isPending && styles.pending]}>
      <Pressable
        style={styles.toggle}
        onPress={() => onToggle(item)}
        disabled={isPending}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.completed, disabled: isPending }}
        accessibilityLabel={item.todo}
      >
        <Ionicons
          name={item.completed ? "checkmark-circle" : "ellipse-outline"}
          size={22}
          color={item.completed ? baseColor.success : baseColor.secondary}
        />
        <Text style={[styles.title, item.completed && styles.titleCompleted]}>
          {item.todo}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onDelete(item)}
        disabled={isPending}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Delete "${item.todo}"`}
      >
        <Ionicons name="trash-outline" size={20} color={baseColor.danger} />
      </Pressable>
    </View>
  );
};

// Memoized so FlatList doesn't re-render every row when a new page is appended
export const TodoListItem = memo(TodoListItemComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: neutralColor.surface,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: neutralColor.border,
  },
  pending: {
    opacity: 0.5,
  },
  toggle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: neutralColor.text,
  },
  titleCompleted: {
    color: neutralColor.textMuted,
    textDecorationLine: "line-through",
  },
});
