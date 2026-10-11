import { createFileRoute } from "@tanstack/react-router";
import { CryptoPage } from "@/components/crypto/CryptoPages";
export const Route = createFileRoute("/crypto/transactions")({
  head: () => ({ meta: [{ title: "Crypto transactions | Vexui" }] }),
  component: () => <CryptoPage kind="transactions" />,
});
