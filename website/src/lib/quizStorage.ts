import type { QuizResponseValue, QuizState } from "@/types";

const ACTIVE_QUIZ_KEY_PREFIX = "ipip-workbench:active-quiz";
const COMPLETED_QUIZZES_KEY = "ipip-workbench:completed-quizzes";
const ACTIVE_QUIZ_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

function getActiveQuizKey(instrumentSlug: string): string {
  return `${ACTIVE_QUIZ_KEY_PREFIX}:${instrumentSlug}`;
}

function isQuizResponseValue(value: unknown): value is QuizResponseValue {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

function parseQuizState(value: unknown): QuizState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<QuizState>;

  if (
    typeof candidate.attemptId !== "string" ||
    typeof candidate.instrumentSlug !== "string" ||
    (candidate.status !== "in-progress" && candidate.status !== "complete") ||
    typeof candidate.dateStarted !== "string" ||
    !candidate.responses ||
    typeof candidate.responses !== "object"
  ) {
    return null;
  }

  const responses: QuizState["responses"] = {};

  for (const [itemId, responseValue] of Object.entries(candidate.responses)) {
    if (isQuizResponseValue(responseValue)) {
      responses[itemId] = responseValue;
    }
  }

  return {
    attemptId: candidate.attemptId,
    instrumentSlug: candidate.instrumentSlug,
    status: candidate.status,
    dateStarted: candidate.dateStarted,
    dateFinished:
      typeof candidate.dateFinished === "string"
        ? candidate.dateFinished
        : null,
    responses,
  };
}

function readStoredQuizState(storageValue: string | null): QuizState | null {
  if (!storageValue) {
    return null;
  }

  try {
    return parseQuizState(JSON.parse(storageValue));
  } catch {
    return null;
  }
}

function isActiveQuizStateStale(quizState: QuizState): boolean {
  const dateStarted = new Date(quizState.dateStarted).getTime();

  if (Number.isNaN(dateStarted)) {
    return true;
  }

  return Date.now() - dateStarted > ACTIVE_QUIZ_MAX_AGE_MS;
}

export function loadActiveQuizState(instrumentSlug: string): QuizState | null {
  if (typeof window === "undefined") {
    return null;
  }

  let quizState: QuizState | null;

  try {
    quizState = readStoredQuizState(
      window.localStorage.getItem(getActiveQuizKey(instrumentSlug)),
    );
  } catch {
    return null;
  }

  if (
    quizState?.instrumentSlug !== instrumentSlug ||
    quizState.status !== "in-progress"
  ) {
    return null;
  }

  if (isActiveQuizStateStale(quizState)) {
    clearActiveQuizState(instrumentSlug);
    return null;
  }

  return quizState;
}

export function saveActiveQuizState(quizState: QuizState): void {
  if (typeof window === "undefined" || quizState.status !== "in-progress") {
    return;
  }

  try {
    window.localStorage.setItem(
      getActiveQuizKey(quizState.instrumentSlug),
      JSON.stringify(quizState),
    );
  } catch {
    // Storage is best-effort; quiz state still lives in React state.
  }
}

export function clearActiveQuizState(instrumentSlug: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(getActiveQuizKey(instrumentSlug));
  } catch {
    // Ignore blocked storage.
  }
}

export function loadCompletedQuizStates(): QuizState[] {
  if (typeof window === "undefined") {
    return [];
  }

  let storageValue: string | null;

  try {
    storageValue = window.localStorage.getItem(COMPLETED_QUIZZES_KEY);
  } catch {
    return [];
  }

  if (!storageValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(storageValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(parseQuizState)
      .filter(
        (quizState): quizState is QuizState =>
          quizState !== null && quizState.status === "complete",
      );
  } catch {
    return [];
  }
}

export function loadCompletedQuizState(attemptId: string): QuizState | null {
  return (
    loadCompletedQuizStates().find(
      (quizState) => quizState.attemptId === attemptId,
    ) ?? null
  );
}

export function saveCompletedQuizState(quizState: QuizState): void {
  if (typeof window === "undefined" || quizState.status !== "complete") {
    return;
  }

  const currentCompletedStates = loadCompletedQuizStates();
  const nextCompletedStates = [
    quizState,
    ...currentCompletedStates.filter(
      (currentState) => currentState.attemptId !== quizState.attemptId,
    ),
  ];

  try {
    window.localStorage.setItem(
      COMPLETED_QUIZZES_KEY,
      JSON.stringify(nextCompletedStates),
    );
  } catch {
    // Storage is best-effort; results are still available for this navigation.
  }
}

export function deleteCompletedQuizState(attemptId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const nextCompletedStates = loadCompletedQuizStates().filter(
    (quizState) => quizState.attemptId !== attemptId,
  );

  try {
    window.localStorage.setItem(
      COMPLETED_QUIZZES_KEY,
      JSON.stringify(nextCompletedStates),
    );
  } catch {
    // Ignore blocked storage.
  }
}
