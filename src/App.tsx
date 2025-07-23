import { BrowserRouter, Routes, Route } from "react-router-dom";
import RouteDetail from "./components/RouteDetail";
import BusBoard from "./components/BusBoard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BusBoard />} />
        <Route path="/route/:vehicleId" element={<RouteDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
