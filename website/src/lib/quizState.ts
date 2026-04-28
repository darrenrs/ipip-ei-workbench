import type { QuizResponseValue, QuizState } from "@/types";

const DEV_OVERRIDE = false;

// temp debug use 2026-04-27
const DEV_RESPONSES_BIS_BAS: Partial<Record<string, QuizResponseValue>> = {
  a13: 4,
  a71: 2,
  d58: 2,
  d71: 4,
  d75: 5,
  d79: 1,
  d96: 5,
  e122: 2,
  e35: 1,
  h1193: 4,
  h1327: 2,
  h317: 4,
  h334: 3,
  // h572: 2, // leave commented out for transition from 97% to 100%
  h793: 3,
  h870: 2,
  h905: 5,
  h959: 4,
  h987: 5,
  p420: 5,
  p434: 4,
  p445: 2,
  p462: 2,
  p474: 1,
  q117: 3,
  q204: 4,
  q50: 3,
  r33: 2,
  r43: 2,
  r5: 5,
  r58: 1,
  x107: 5,
  x110: 1,
  x242: 1,
  x250: 2,
  x3: 3,
};

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

  if (DEV_OVERRIDE && instrumentSlug === "bis-bas") {
    return {
      attemptId,
      instrumentSlug,
      status: "in-progress",
      dateStarted: new Date().toISOString(),
      dateFinished: null,
      responses: DEV_RESPONSES_BIS_BAS,
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
