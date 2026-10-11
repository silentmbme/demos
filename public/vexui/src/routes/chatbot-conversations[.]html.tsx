import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/chatbot-conversations.html")({
  beforeLoad: () => {
    throw redirect({ to: "/ai-analytics/chatbot-conversations" });
  },
});
