import { baseColor } from "@/constants/style";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: baseColor.primary,
            },
            headerTintColor: "white",
            headerTitleStyle: {
              fontSize: 26,
              fontWeight: "bold",
            },
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Todo List" }} />
        </Stack>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
