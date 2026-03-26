import { ProtectedClient } from "./protected-client";

export const dynamic = "force-dynamic";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedClient>{children}</ProtectedClient>;
}
