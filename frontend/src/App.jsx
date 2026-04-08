import { Navigate, Route, Routes } from "react-router-dom";
import CanvasPage from "./pages/CanvasPage";
import ResultsPage from "./pages/ResultsPage";
import ComparePage from "./pages/ComparePage";
import GuidePage from "./pages/GuidePage";
import ToastViewport from "./components/ToastViewport";
import TopBar from "./components/TopBar";

export default function App() {
  return (
    <>
      <TopBar />
      <div className="app-content">
        <Routes>
          <Route path="/canvas" element={<CanvasPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/canvas" replace />} />
        </Routes>
      </div>
      <ToastViewport />
    </>
  );
}
