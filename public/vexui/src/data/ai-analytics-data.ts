export type AiPeriod = "7" | "30" | "90";

export const AI_MODELS = [
  {
    id: "atlas-pro",
    name: "Atlas Pro",
    category: "Reasoning & analysis",
    requests: 48260,
    tokens: 18_600_000,
    cost: 486.2,
    latency: 1.24,
    success: 99.8,
    change: 18.4,
    color: "--primary",
    status: "Healthy",
  },
  {
    id: "atlas-mini",
    name: "Atlas Mini",
    category: "Fast text generation",
    requests: 72480,
    tokens: 24_200_000,
    cost: 168.4,
    latency: 0.42,
    success: 99.9,
    change: 24.8,
    color: "--chart-2",
    status: "Healthy",
  },
  {
    id: "vision-one",
    name: "Vision One",
    category: "Image understanding",
    requests: 18420,
    tokens: 9_800_000,
    cost: 294.6,
    latency: 2.18,
    success: 98.6,
    change: 12.6,
    color: "--chart-3",
    status: "Elevated latency",
  },
  {
    id: "embed-v2",
    name: "Embed v2",
    category: "Search & retrieval",
    requests: 32640,
    tokens: 8_400_000,
    cost: 42.8,
    latency: 0.18,
    success: 99.9,
    change: 8.2,
    color: "--chart-4",
    status: "Healthy",
  },
] as const;

export type AiModel = (typeof AI_MODELS)[number];

const DAILY_WEIGHTS = [0.64, 0.78, 0.72, 0.92, 0.81, 0.96, 0.88, 1.04, 0.94, 1.12, 1.08, 1.24];

export function getAiAnalytics(period: AiPeriod, modelId: string) {
  const factor = Number(period) / 30;
  const models = AI_MODELS.filter((model) => modelId === "all" || model.id === modelId).map(
    (model) => ({
      ...model,
      requests: Math.round(model.requests * factor),
      tokens: Math.round(model.tokens * factor),
      cost: Math.round(model.cost * factor * 100) / 100,
    }),
  );
  const requests = models.reduce((sum, model) => sum + model.requests, 0);
  const tokens = models.reduce((sum, model) => sum + model.tokens, 0);
  const cost = models.reduce((sum, model) => sum + model.cost, 0);
  const latency =
    models.reduce((sum, model) => sum + model.latency * model.requests, 0) / (requests || 1);
  const success =
    models.reduce((sum, model) => sum + model.success * model.requests, 0) / (requests || 1);
  const change =
    models.reduce((sum, model) => sum + model.change * model.requests, 0) / (requests || 1);
  const buckets = period === "7" ? 7 : 12;
  const weights = DAILY_WEIGHTS.slice(0, buckets);
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const requestSeries = weights.map((weight) => Math.floor((weight / weightTotal) * requests));
  // Keep the chart total equal to the metric after rounding.
  requestSeries[buckets - 1] =
    (requestSeries[buckets - 1] ?? 0) +
    requests -
    requestSeries.reduce((sum, value) => sum + value, 0);
  const labels = weights.map((_, index) => {
    const offset = Math.round(((buckets - 1 - index) * (Number(period) - 1)) / (buckets - 1));
    const date = new Date(Date.UTC(2026, 9, 9 - offset));
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  });
  const tokenSeries = requestSeries.map((value) => Math.floor((value * tokens) / (requests || 1)));
  tokenSeries[buckets - 1] =
    (tokenSeries[buckets - 1] ?? 0) + tokens - tokenSeries.reduce((sum, value) => sum + value, 0);
  const failedRequests = Math.round(requests * (1 - success / 100));
  const failedSeries = requestSeries.map((value) => Math.floor(value * (1 - success / 100)));
  failedSeries[buckets - 1] =
    (failedSeries[buckets - 1] ?? 0) +
    failedRequests -
    failedSeries.reduce((sum, value) => sum + value, 0);
  const inputTokens = Math.round(tokens * 0.6);
  const cachedTokens = Math.round(tokens * 0.12);
  const outputTokens = tokens - inputTokens - cachedTokens;
  const inputTokenSeries = tokenSeries.map((value) => Math.floor(value * 0.6));
  const cachedTokenSeries = tokenSeries.map((value) => Math.floor(value * 0.12));
  inputTokenSeries[buckets - 1] =
    (inputTokenSeries[buckets - 1] ?? 0) +
    inputTokens -
    inputTokenSeries.reduce((sum, value) => sum + value, 0);
  cachedTokenSeries[buckets - 1] =
    (cachedTokenSeries[buckets - 1] ?? 0) +
    cachedTokens -
    cachedTokenSeries.reduce((sum, value) => sum + value, 0);
  const outputTokenSeries = tokenSeries.map(
    (value, index) => value - (inputTokenSeries[index] ?? 0) - (cachedTokenSeries[index] ?? 0),
  );
  const activityWeights = [0.56, 0.8, 1.12, 1.34, 1.06, 0.72];
  const dayWeights = [1.08, 1.2, 1.16, 1.24, 1.1, 0.62, 0.48];
  const activityTotal =
    activityWeights.reduce((sum, weight) => sum + weight, 0) *
    dayWeights.reduce((sum, weight) => sum + weight, 0);
  const activity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((name, day) => ({
    name,
    data: activityWeights.map((weight, index) => ({
      x: ["00–04", "04–08", "08–12", "12–16", "16–20", "20–24"][index] ?? "",
      y: Math.floor((requests * weight * (dayWeights[day] ?? 1)) / activityTotal),
    })),
  }));
  const lastActivity = activity[6]?.data[5];
  if (lastActivity)
    lastActivity.y +=
      requests -
      activity.reduce((sum, day) => sum + day.data.reduce((total, point) => total + point.y, 0), 0);
  return {
    models,
    requests,
    tokens,
    cost,
    latency,
    success,
    change,
    requestSeries,
    tokenSeries,
    failedRequests,
    failedSeries,
    inputTokens,
    outputTokens,
    cachedTokens,
    inputTokenSeries,
    cachedTokenSeries,
    outputTokenSeries,
    activity,
    labels,
  };
}

export const AI_WORKLOADS = [
  {
    id: "RUN-2048",
    modelId: "atlas-pro",
    name: "Weekly research summary",
    category: "Document analysis",
    tokens: 12480,
    duration: "1.4s",
    status: "Completed",
    time: "Oct 9, 14:32",
  },
  {
    id: "RUN-2047",
    modelId: "atlas-mini",
    name: "Support reply generation",
    category: "Customer experience",
    tokens: 3240,
    duration: "0.4s",
    status: "Completed",
    time: "Oct 9, 14:28",
  },
  {
    id: "RUN-2046",
    modelId: "vision-one",
    name: "Product image classification",
    category: "Image processing",
    tokens: 8160,
    duration: "3.1s",
    status: "Retried",
    time: "Oct 9, 14:21",
  },
  {
    id: "RUN-2045",
    modelId: "embed-v2",
    name: "Knowledge base indexing",
    category: "Semantic search",
    tokens: 28600,
    duration: "0.2s",
    status: "Completed",
    time: "Oct 9, 14:18",
  },
  {
    id: "RUN-2044",
    modelId: "atlas-pro",
    name: "Quarterly forecast review",
    category: "Financial analysis",
    tokens: 18920,
    duration: "1.6s",
    status: "Completed",
    time: "Oct 9, 14:12",
  },
] as const;

export function formatAiNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatAiCost(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}
