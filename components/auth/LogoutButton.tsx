import { useAuth } from "@/hooks";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable } from "react-native";

type Props = {
  tintColor?: string;
};

export const LogoutButton: React.FC<Props> = ({ tintColor = "white" }) => {
  const { signOut } = useAuth();

  const confirmLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <Pressable
      onPress={confirmLogout}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Log out"
    >
      <Ionicons name="log-out-outline" size={24} color={tintColor} />
    </Pressable>
  );
};
