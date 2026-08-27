import { AuthGuard } from "@/components/auth/route-guard";

export default function MeLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
