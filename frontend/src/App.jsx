import { Navigate, Route, Routes } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import ResultsPage from "./pages/ResultsPage";
import ComparePage from "./pages/ComparePage";
import ToastViewport from "./components/ToastViewport";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="*" element={<Navigate to="/canvas" replace />} />
      </Routes>
      <ToastViewport />
    </>
  );
}
