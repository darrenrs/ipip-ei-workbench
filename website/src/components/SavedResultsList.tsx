import { useState } from "react";
import { Link } from "react-router-dom";
import { getInstrument } from "@/lib/instruments";
import {
  deleteCompletedQuizState,
  loadCompletedQuizStates,
} from "@/lib/quizStorage";
import type { QuizState } from "@/types";

type SavedResultsListProps = {
  instrumentSlug?: string;
};

function getAttemptTimestamp(quizState: QuizState): number {
  return new Date(quizState.dateFinished ?? quizState.dateStarted).getTime();
}

function formatAttemptTimestamp(quizState: QuizState): string {
  const timestamp = getAttemptTimestamp(quizState);

  if (Number.isNaN(timestamp)) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(timestamp);
}

function sortAttemptsDescending(attempts: QuizState[]): QuizState[] {
  return [...attempts].sort(
    (left, right) => getAttemptTimestamp(right) - getAttemptTimestamp(left),
  );
}

export default function SavedResultsList({
  instrumentSlug,
}: SavedResultsListProps) {
  const [attemptIdPendingDeletion, setAttemptIdPendingDeletion] = useState<
    string | null
  >(null);
  const [attempts, setAttempts] = useState(() =>
    sortAttemptsDescending(
      loadCompletedQuizStates().filter(
        (quizState) =>
          !instrumentSlug || quizState.instrumentSlug === instrumentSlug,
      ),
    ),
  );

  function deleteAttempt(attemptId: string) {
    deleteCompletedQuizState(attemptId);
    setAttempts((currentAttempts) =>
      currentAttempts.filter((attempt) => attempt.attemptId !== attemptId),
    );
    setAttemptIdPendingDeletion(null);
  }

  if (attempts.length === 0) {
    return <p className="empty-results-message">No results yet</p>;
  }

  return (
    <div className="saved-results-list">
      {attempts.map((attempt) => {
        const instrument = getInstrument(attempt.instrumentSlug);
        const instrumentName = instrument?.name ?? attempt.instrumentSlug;

        return (
          <article key={attempt.attemptId} className="saved-result-row">
            <div className="saved-result-main">
              <h3>{instrumentName}</h3>
              <p>{formatAttemptTimestamp(attempt)}</p>
            </div>
            <div className="saved-result-actions">
              {attemptIdPendingDeletion === attempt.attemptId ? (
                <div
                  className="saved-result-confirmation"
                  role="group"
                  aria-label={`Confirm deletion of ${instrumentName} result`}
                >
                  <span>Delete this result?</span>
                  <button
                    type="button"
                    className="saved-result-confirm"
                    onClick={() => deleteAttempt(attempt.attemptId)}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    className="saved-result-cancel"
                    onClick={() => setAttemptIdPendingDeletion(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    className="button-link saved-result-view"
                    to={`/instrument/${attempt.instrumentSlug}/results/${attempt.attemptId}`}
                  >
                    View Results
                  </Link>
                  <button
                    type="button"
                    className="saved-result-delete"
                    aria-label={`Delete ${instrumentName} result from ${formatAttemptTimestamp(
                      attempt,
                    )}`}
                    onClick={() =>
                      setAttemptIdPendingDeletion(attempt.attemptId)
                    }
                  >
                    x
                  </button>
                </>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
