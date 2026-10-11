import { createFileRoute } from "@tanstack/react-router";
import { CryptoPage } from "@/components/crypto/CryptoPages";
export const Route = createFileRoute("/crypto/exchange")({
  head: () => ({ meta: [{ title: "Crypto exchange | Vexui" }] }),
  component: () => <CryptoPage kind="exchange" />,
});
