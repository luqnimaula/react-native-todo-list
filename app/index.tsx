import { useAuth } from "@/hooks";
import { Redirect } from "expo-router";

export default function Index() {
  const { status } = useAuth();
  return <Redirect href={status === "signedIn" ? "/list" : "/login"} />;
}
