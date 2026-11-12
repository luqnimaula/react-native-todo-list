import { neutralColor } from "@/constants/style";
import { StyleSheet, Text, View } from "react-native";
import { AppButton } from "./AppButton";

type Props = {
  title: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
};

/** Centered title + message, with an optional action button (empty / error states). */
export const StateMessage: React.FC<Props> = ({
  title,
  message,
  actionTitle,
  onAction,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionTitle && onAction ? (
        <AppButton title={actionTitle} onPress={onAction} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: neutralColor.text,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: neutralColor.textMuted,
    textAlign: "center",
    marginBottom: 8,
  },
});
