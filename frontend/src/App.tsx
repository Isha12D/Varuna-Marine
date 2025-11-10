// App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Componenets/Navbar";
import Footer from "./Componenets/Footer";
import RoutesPage from "./Tabs/Routes";
import ComparePage from "./Tabs/Compare";
import BankingPage from "./Tabs/BankingTab";
import PoolingPage from "./Tabs/PoolingPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <Navbar />

        {/* Main Content */}
        <div className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/routes" replace />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/banking" element={<BankingPage />} />
            <Route path="/pooling" element={<PoolingPage />} />
          </Routes>
        </div>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
