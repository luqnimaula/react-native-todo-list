import { baseColor, neutralColor } from "@/constants/style";
import { forwardRef } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

type Props = {
  label: string;
  error?: string;
} & TextInputProps;

export const AppTextInput = forwardRef<TextInput, Props>(
  ({ label, error, style, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          ref={ref}
          placeholderTextColor={neutralColor.textMuted}
          accessibilityLabel={label}
          {...props}
          style={[styles.input, error ? styles.inputError : null, style]}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
    );
  },
);

AppTextInput.displayName = "AppTextInput";

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: neutralColor.text,
  },
  input: {
    borderWidth: 1,
    borderColor: neutralColor.border,
    borderRadius: 8,
    backgroundColor: neutralColor.surface,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: neutralColor.text,
  },
  inputError: {
    borderColor: baseColor.danger,
  },
  error: {
    fontSize: 13,
    color: baseColor.danger,
  },
});
