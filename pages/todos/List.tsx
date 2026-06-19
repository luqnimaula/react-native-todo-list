import { AppButton } from "@/components/ui";
import { useTodos } from "@/hooks";
import { router } from "expo-router";
import { Fragment, useEffect } from "react";
import { Text, View } from "react-native";

const List: React.FC = () => {
  const { isLoading, getTodos, records } = useTodos();

  useEffect(() => {
    getTodos();
  }, []);

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
