import { useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { responseOptions } from "@/lib/quizLabels";
import { getInstrument, getInstrumentData, hasInstrument } from "@/lib/instruments";
import PageLayout from "@/pages/PageLayout";
import { createQuizState } from "@/lib/quizState";
import type { QuizResponseValue, QuizState } from "@/types";

export default function QuizPage() {
  const { slug } = useParams();

  if (!slug || !hasInstrument(slug)) {
    return <Navigate to="/" replace />;
  }

  return <QuizPageContent key={slug} slug={slug} />;
}

type QuizPageContentProps = {
  slug: string;
};

function QuizPageContent({ slug }: QuizPageContentProps) {
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<QuizState>(() =>
    createQuizState(slug),
  );

  const instrument = getInstrument(slug)!;
  const instrumentData = getInstrumentData(slug)!;
  const totalItems = instrumentData.items.length;
  const answeredCount = instrumentData.items.filter(
    (item) => quizState.responses[item.id] !== undefined,
  ).length;
  const progressPercent = (answeredCount / totalItems) * 100;
  const isComplete = answeredCount === totalItems;

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

    navigate(`/instrument/${instrument.slug}/results`, {
      state: {
        quizState: {
          ...quizState,
          status: "complete",
          dateFinished: new Date().toISOString(),
        },
      },
    });
  }

  return (
    <PageLayout>
      <div className="page-stack">
        <section className="hero stack">
          <span className="label">Quiz</span>
          <h1>{instrument.name}</h1>
          <p>
            For each of the questions, please select how well the statement
            describes you. To ensure maximum accuracy, you must answer all
            questions to see your results. Your results are not currently stored
            or saved anywhere.
          </p>
        </section>
        <section className="page-section">
          <div className="question-list">
            {instrumentData.items.map((item, index) => {
              const selectedResponse = quizState.responses[item.id];

              return (
                <article key={item.id} className="card question-card">
                  <div className="question-card-main">
                    <p className="question-count">
                      ITEM {index + 1} / {instrumentData.items.length}
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
            <Link to={`/instrument/${instrument.slug}`} className="button-link">
              Back
            </Link>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
