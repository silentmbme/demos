import { AppShell } from "@/components/layout/AppShell";
import { InsightsPage } from "./InsightsPage";
import { ChatbotConversationsPage } from "./ChatbotConversationsPage";
import { PredictionsPage } from "./PredictionsPage";
import { ModelSettingsPage } from "./ModelSettingsPage";
type Kind = "insights" | "chatbot" | "predictions" | "models";
export function AiAnalyticsPage({ kind }: { kind: Kind }) {
  return (
    <AppShell>
      {kind === "insights" ? (
        <InsightsPage />
      ) : kind === "chatbot" ? (
        <ChatbotConversationsPage />
      ) : kind === "predictions" ? (
        <PredictionsPage />
      ) : (
        <ModelSettingsPage />
      )}
    </AppShell>
  );
}
