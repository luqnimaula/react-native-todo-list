import { AppButton, AppTextInput } from "@/components/ui";
import { baseColor, neutralColor } from "@/constants/style";
import { useAuth } from "@/hooks";
import { AuthLoginPayload } from "@/types/auth";
import { getError } from "@/utils/error";
import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Sample account from https://dummyjson.com/docs/auth
const DEMO_CREDENTIALS: AuthLoginPayload = {
  username: "emilys",
  password: "emilyspass",
};

type FieldErrors = Partial<Record<keyof AuthLoginPayload, string>>;

const validate = ({ username, password }: AuthLoginPayload): FieldErrors => {
  const errors: FieldErrors = {};
  if (!username.trim()) errors.username = "Username is required";
  if (!password) errors.password = "Password is required";
  return errors;
};

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [form, setForm] = useState<AuthLoginPayload>({
    username: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof AuthLoginPayload, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setFormError(null);
    try {
      // On success the route guard swaps this screen for the todo list
      await signIn({ username: form.username.trim(), password: form.password });
    } catch (err) {
      setFormError(getError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.heading}>
            <Text style={styles.title}>Todo List</Text>
            <Text style={styles.subtitle}>Log in to see your todos</Text>
          </View>

          <View style={styles.form}>
            <AppTextInput
              label="Username"
              value={form.username}
              onChangeText={(value) => updateField("username", value)}
              error={fieldErrors.username}
              placeholder="emilys"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="username"
              textContentType="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              editable={!isSubmitting}
            />
            <AppTextInput
              ref={passwordRef}
              label="Password"
              value={form.password}
              onChangeText={(value) => updateField("password", value)}
              error={fieldErrors.password}
              placeholder="••••••••"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              editable={!isSubmitting}
            />

            {formError ? (
              <Text style={styles.formError} accessibilityRole="alert">
                {formError}
              </Text>
            ) : null}

            <AppButton
              title={isSubmitting ? "Logging in…" : "Log in"}
              size="lg"
              onPress={handleSubmit}
              disabled={isSubmitting}
            />
          </View>

          <View style={styles.demoNote}>
            <Text style={styles.demoTitle}>Testing? Use the DummyJSON demo account</Text>
            <Text style={styles.demoText}>
              Username: {DEMO_CREDENTIALS.username}
              {"\n"}Password: {DEMO_CREDENTIALS.password}
            </Text>
            <Pressable
              onPress={() => {
                setForm(DEMO_CREDENTIALS);
                setFieldErrors({});
                setFormError(null);
              }}
              disabled={isSubmitting}
              accessibilityRole="button"
            >
              <Text style={styles.demoLink}>Fill in demo credentials</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: neutralColor.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    gap: 24,
  },
  heading: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: baseColor.primary,
  },
  subtitle: {
    fontSize: 15,
    color: neutralColor.textMuted,
  },
  form: {
    gap: 16,
  },
  formError: {
    fontSize: 14,
    color: baseColor.danger,
  },
  demoNote: {
    gap: 6,
    padding: 16,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: neutralColor.border,
    backgroundColor: neutralColor.surface,
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: neutralColor.text,
  },
  demoText: {
    fontSize: 13,
    color: neutralColor.textMuted,
    lineHeight: 20,
  },
  demoLink: {
    fontSize: 13,
    fontWeight: "600",
    color: baseColor.primary,
  },
});
