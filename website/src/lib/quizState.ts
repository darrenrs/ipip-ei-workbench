import type { QuizState } from "@/types";
import { DEV_RESPONSES } from "./quizState_dev";

// Crypto library is not supported over HTTP; workaround for LAN dev
function createAttemptId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `dev_${Date.now()}`;
}

export function createQuizState(instrumentSlug: string): QuizState {
  const attemptId = createAttemptId();

  if (import.meta.env.MODE === "development") {
    return {
      attemptId,
      instrumentSlug,
      status: "in-progress",
      dateStarted: new Date().toISOString(),
      dateFinished: null,
      responses: DEV_RESPONSES,
    };
  }

  return {
    attemptId,
    instrumentSlug,
    status: "in-progress",
    dateStarted: new Date().toISOString(),
    dateFinished: null,
    responses: {},
  };
}
