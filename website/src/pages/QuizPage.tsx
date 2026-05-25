import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { loadInstrumentGeneratedData } from "@/lib/data/instrumentGeneratedData";
import { responseOptions } from "@/lib/quizLabels";
import { getInstrument } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";
import { createQuizState } from "@/lib/quizState";
import {
  clearActiveQuizState,
  loadActiveQuizState,
  saveActiveQuizState,
  saveCompletedQuizState,
} from "@/lib/quizStorage";
import type {
  GeneratedInstrumentData,
  GeneratedInstrumentItem,
  QuizResponseValue,
  QuizState,
} from "@/types";

const QUIZ_ORDER_SEED = "mammoth";

function hashSeededValue(input: string) {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function getOrderedQuizItems(
  slug: string,
  items: GeneratedInstrumentItem[],
): GeneratedInstrumentItem[] {
  const orderedItems = items
    .map((item, index) => ({
      item,
      index,
      sortKey: hashSeededValue(`${QUIZ_ORDER_SEED}:${slug}:${item.id}`),
    }))
    .sort(
      (left, right) => left.sortKey - right.sortKey || left.index - right.index,
    )
    .map(({ item }) => item);

  const matchesSourceOrder = orderedItems.every(
    (item, index) => item.id === items[index]?.id,
  );

  if (matchesSourceOrder && orderedItems.length > 1) {
    return [...orderedItems.slice(1), orderedItems[0]];
  }

  return orderedItems;
}

export default function QuizPage() {
  const { slug } = useParams();

  if (!slug) {
    return <Navigate to="/" replace />;
  }

  const instrument = getInstrument(slug);

  if (!instrument) {
    return <Navigate to="/" replace />;
  }

  return <QuizPageContent key={slug} slug={slug} />;
}

type QuizPageContentProps = {
  slug: string;
};

function QuizPageContent({ slug }: QuizPageContentProps) {
  const navigate = useNavigate();
  const instrument = getInstrument(slug)!;
  const [quizState, setQuizState] = useState<QuizState>(() =>
    loadActiveQuizState(slug) ?? createQuizState(slug),
  );
  const [loadState, setLoadState] = useState<{
    instrumentData: GeneratedInstrumentData | null;
    loadError: boolean;
  }>({
    instrumentData: null,
    loadError: false,
  });

  useEffect(() => {
    let isActive = true;

    loadInstrumentGeneratedData(slug)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: data,
          loadError: false,
        });
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setLoadState({
          instrumentData: null,
          loadError: true,
        });
      });

    return () => {
      isActive = false;
    };
  }, [slug]);

  const { instrumentData, loadError } = loadState;
  const isLoading = instrumentData === null && !loadError;
  const labelText = loadError
    ? `Failed to load data for ${slug}. Please refresh the page to try again.`
    : isLoading
      ? `Loading ${slug} ...`
      : "Quiz";

  const orderedItems = instrumentData
    ? getOrderedQuizItems(slug, instrumentData.items)
    : [];
  const totalItems = orderedItems.length;
  const answeredCount = orderedItems.filter(
    (item) => quizState.responses[item.id] !== undefined,
  ).length;
  const progressPercent = totalItems > 0 ? (answeredCount / totalItems) * 100 : 0;
  const isComplete = totalItems > 0 && answeredCount === totalItems;
  const shouldWarnBeforeUnload =
    instrumentData !== null && quizState.status === "in-progress";

  useEffect(() => {
    if (quizState.status === "in-progress") {
      saveActiveQuizState(quizState);
    }
  }, [quizState]);

  useEffect(() => {
    if (!shouldWarnBeforeUnload) {
      return;
    }

    function warnBeforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", warnBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
    };
  }, [shouldWarnBeforeUnload]);

  if (!instrumentData) {
    return (
      <PageLayout>
        <div className="page-stack">
          <section className="hero stack">
            <span className="label">{labelText}</span>
            <h1>{instrument.name}</h1>
            <p>
              For each of the questions, please select how well the statement
              describes you. To ensure maximum accuracy, you must answer all
              questions to see your results. In-progress answers are saved in
              this browser session, and completed results are saved locally in
              this browser.
            </p>
          </section>
          <section className="page-section">
            <div className="button-row">
              <Link
                to={`/instrument/${instrument.slug}`}
                className="button-link"
              >
                Back
              </Link>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  function selectResponse(itemId: string, value: QuizResponseValue) {
    setQuizState((current) => ({
      ...current,
      responses: {
        ...current.responses,
        [itemId]: value,
      },
    }));
  }

  function submitQuiz() {
    if (!isComplete) {
      return;
    }

    const completedQuizState: QuizState = {
      ...quizState,
      status: "complete",
      dateFinished: new Date().toISOString(),
    };

    saveCompletedQuizState(completedQuizState);
    clearActiveQuizState(instrument.slug);

    navigate(
      `/instrument/${instrument.slug}/results/${completedQuizState.attemptId}`,
      {
        state: {
          quizState: completedQuizState,
        },
      },
    );
  }

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">{labelText}</span>
          <h1>{instrument.name}</h1>
          <p>
            For each of the questions, please select how well the statement
            describes you. To ensure maximum accuracy, you must answer all
            questions to see your results. In-progress answers are saved in this
            browser session, and completed results are saved locally in this
            browser.
          </p>
        </section>
        <section className="page-section">
          <div className="question-list">
            {orderedItems.map((item, index) => {
              const selectedResponse = quizState.responses[item.id];

              return (
                <article key={item.id} className="card question-card">
                  <div className="question-card-main">
                    <p className="question-count">
                      ITEM {index + 1} / {orderedItems.length}
                    </p>
                    <h3 className="question-prompt">{item.prompt}</h3>
                    <p className="question-metadata">
                      IPIP item ID <code>{item.id}</code>
                    </p>
                  </div>

                  <div
                    className="question-card-options"
                    role="group"
                    aria-label={`Response options for item ${index + 1}`}
                  >
                    {responseOptions.map((option) => {
                      const isSelected = selectedResponse === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          aria-pressed={isSelected}
                          className={`question-option${
                            isSelected
                              ? ` is-selected response-${option.value}`
                              : ""
                          }`}
                          onClick={() => selectResponse(item.id, option.value)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-section">
          <div className="quiz-progress">
            <span className="quiz-progress-percent">
              {Math.round(progressPercent)}%
            </span>
            <div
              className="quiz-progress-bar"
              aria-label={`Answered ${answeredCount} of ${totalItems} questions`}
            >
              <div
                className="quiz-progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <p className="muted">
            {isComplete
              ? "You may submit the quiz when you are ready."
              : "Please answer every question before submitting the quiz."}
          </p>

          <div className="button-row">
            <button
              type="button"
              className="button-link button-link-submit"
              disabled={!isComplete}
              onClick={submitQuiz}
            >
              Submit
            </button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
