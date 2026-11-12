import { fetchAuthProfile, login, refreshSession } from "@/services/auth";
import { AuthLoginPayload, AuthStatus, AuthUser } from "@/types/auth";
import { setAuthHandlers } from "@/utils/api";
import { clearTokens, getAccessToken, saveTokens } from "@/utils/tokenStorage";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  /** Rejects on failure so the caller can show the error. */
  signIn: (payload: AuthLoginPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<AuthUser | null>(null);

  const signOut = useCallback(async () => {
    try {
      await clearTokens();
    } finally {
      // Always leave the signed-in state, even if storage cleanup fails
      setUser(null);
      setStatus("signedOut");
    }
  }, []);

  // The profile only adds the user's name, so a failure here is not fatal.
  // An expired session is handled by the api interceptor (refresh or sign out).
  const loadProfile = useCallback(async () => {
    try {
      setUser(await fetchAuthProfile());
    } catch {}
  }, []);

  useEffect(() => {
    setAuthHandlers({
      refreshAccessToken: refreshSession,
      onAuthFailure: signOut,
    });
    return () => setAuthHandlers(null);
  }, [signOut]);

  // Restore a saved session on app start
  useEffect(() => {
    const restoreSession = async () => {
      const token = await getAccessToken();
      setStatus(token ? "signedIn" : "signedOut");
      if (token) {
        loadProfile();
      }
    };
    restoreSession();
  }, [loadProfile]);

  const signIn = useCallback(async (payload: AuthLoginPayload) => {
    const { accessToken, refreshToken, ...profile } = await login(payload);
    await saveTokens({ accessToken, refreshToken });
    setUser(profile);
    setStatus("signedIn");
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signOut }),
    [status, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
};
