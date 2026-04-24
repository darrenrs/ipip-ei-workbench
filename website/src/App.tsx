import { Navigate, Route, Routes } from "react-router-dom";
import DisclaimerPage from "@/pages/DisclaimerPage";
import InstrumentPage from "@/pages/InstrumentPage";
import InstrumentsPage from "@/pages/InstrumentsPage";
import MainPage from "@/pages/MainPage";
import MethodsPage from "@/pages/MethodsPage";
import QuizPage from "@/pages/QuizPage";
import ResultsPage from "@/pages/ResultsPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/instruments" element={<InstrumentsPage />} />
      <Route path="/instruments/:slug" element={<InstrumentPage />} />
      <Route path="/quiz/:slug" element={<QuizPage />} />
      <Route path="/results/:slug" element={<ResultsPage />} />
      <Route path="/methods" element={<MethodsPage />} />
      <Route path="/disclaimer" element={<DisclaimerPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
