import { AppButton } from "@/components/ui";
import { router } from "expo-router";
import { View } from "react-native";

export default function Index() {
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
    </View>
  );
}
