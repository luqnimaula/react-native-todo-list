import { AppButton } from "@/components/ui";
import { baseColor, neutralColor } from "@/constants/style";
import { AppError } from "@/types/error";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const MAX_LENGTH = 200;

type Props = {
  /** Resolves with an error if the todo couldn't be added. */
  onSubmit: (text: string) => Promise<AppError | null>;
};

export const AddTodoForm: React.FC<Props> = ({ onSubmit }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Write something first");
      return;
    }

    // Clear right away (the todo appears optimistically)...
    setText("");
    setError(null);

    const submitError = await onSubmit(trimmed);
    if (submitError) {
      // ...and restore the text on failure, unless the user typed something new
      setText((current) => current || trimmed);
      setError(submitError.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={text}
          onChangeText={(value) => {
            setText(value);
            setError(null);
          }}
          placeholder="What needs to be done?"
          placeholderTextColor={neutralColor.textMuted}
          accessibilityLabel="New todo"
          maxLength={MAX_LENGTH}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
        <AppButton title="Add" onPress={handleSubmit} />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
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
