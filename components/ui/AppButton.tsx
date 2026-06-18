import { baseColor } from "@/constants/style";
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from "react-native";

type AppButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type AppButtonSize = "xl" | "lg" | "md" | "sm" | "xs";

type Props = {
  title: string;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
} & PressableProps;

export const AppButton: React.FC<Props> = ({
  title,
  variant = "primary",
  size = "md",
  ...props
}) => {
  return (
    <Pressable
      {...props}
      style={{
        ...ButtonVariantStyleSheet[variant],
        borderRadius: 5,
        opacity: props.disabled ? 0.7 : 1,
      }}
    >
      <Text
        style={[
          ButtonVariantTextColorStyleSheet[variant],
          ButtonSizeStyleSheet[size],
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

const ButtonVariantStyleSheet: Record<AppButtonVariant, ViewStyle> =
  StyleSheet.create({
    primary: {
      backgroundColor: baseColor.primary,
      color: "#ffffff",
    },
    secondary: {
      backgroundColor: baseColor.secondary,
      color: "#ffffff",
    },
    success: {
      backgroundColor: baseColor.success,
      color: "#ffffff",
    },
    warning: {
      backgroundColor: baseColor.warning,
      color: "#ffffff",
    },
    danger: {
      backgroundColor: baseColor.danger,
      color: "#ffffff",
    },
  });

const ButtonVariantTextColorStyleSheet: Record<AppButtonVariant, TextStyle> =
  StyleSheet.create({
    primary: {
      color: "#ffffff",
    },
    secondary: {
      color: "#ffffff",
    },
    success: {
      color: "#ffffff",
    },
    warning: {
      color: "#ffffff",
    },
    danger: {
      color: "#ffffff",
    },
  });

const ButtonSizeStyleSheet: Record<AppButtonSize, TextStyle> =
  StyleSheet.create({
    xl: {
      fontSize: 18,
      paddingVertical: 10,
      paddingHorizontal: 20,
      textTransform: "uppercase",
      textAlign: "center",
    },
    lg: {
      fontSize: 16,
      paddingVertical: 9,
      paddingHorizontal: 18,
      textTransform: "uppercase",
      textAlign: "center",
    },
    md: {
      fontSize: 14,
      paddingVertical: 8,
      paddingHorizontal: 16,
      textTransform: "uppercase",
      textAlign: "center",
    },
    sm: {
      fontSize: 13,
      paddingVertical: 7,
      paddingHorizontal: 12,
      textTransform: "uppercase",
      textAlign: "center",
    },
    xs: {
      fontSize: 12,
      paddingVertical: 6,
      paddingHorizontal: 10,
      textTransform: "uppercase",
      textAlign: "center",
    },
  });
