import { AppButton } from "@/components/ui";
import { useTodos } from "@/hooks";
import { router } from "expo-router";
import { Fragment, useEffect } from "react";
import { Text, View } from "react-native";

const List: React.FC = () => {
  const { refetch, records } = useTodos();

  // `refetch` is memoized with useCallback, so this runs once on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AppButton
        title="Show My Todo List"
        onPress={() => router.push("/list")}
      />
      {records.map((record) => {
        return (
          <Fragment key={record.id}>
            <Text>{record.todo}</Text>
          </Fragment>
        );
      })}
    </View>
  );
};

export default List;
