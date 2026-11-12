import { baseColor } from "@/constants/style";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // The native Stack header already pads for the status bar / notch,
    // so screens don't need a SafeAreaView around the whole Stack.
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: baseColor.primary,
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ title: "Todo List" }} />
      </Stack>
    </SafeAreaProvider>
  );
}
