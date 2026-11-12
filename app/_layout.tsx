import { LogoutButton } from "@/components/auth";
import { baseColor } from "@/constants/style";
import { AuthProvider, useAuth } from "@/hooks";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen up until we know whether a session exists
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { status } = useAuth();

  useEffect(() => {
    if (status !== "loading") {
      SplashScreen.hide();
    }
  }, [status]);

  if (status === "loading") {
    return null;
  }

  const isSignedIn = status === "signedIn";

  // When a guard turns false, Expo Router redirects away from that screen,
  // so logging in/out switches screens without manual navigation.
  return (
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
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen
          name="list"
          options={{
            title: "Todo List",
            headerRight: () => <LogoutButton />,
          }}
        />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    // The native Stack header already pads for the status bar / notch,
    // so screens don't need a SafeAreaView around the whole Stack.
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
