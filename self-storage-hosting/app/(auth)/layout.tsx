import { AuthProvider } from "@/lib/auth-context";
import SiteChrome from "@/components/SiteChrome";

// Only the account pages need the signed-in state, so only they mount the
// provider. Marketing pages never call the account server.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SiteChrome>{children}</SiteChrome>
    </AuthProvider>
  );
}
