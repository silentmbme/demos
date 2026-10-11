import { createFileRoute } from "@tanstack/react-router";
import { CryptoPage } from "@/components/crypto/CryptoPages";
export const Route = createFileRoute("/crypto/wallet")({
  head: () => ({ meta: [{ title: "Crypto wallet | Vexui" }] }),
  component: () => <CryptoPage kind="wallet" />,
});
