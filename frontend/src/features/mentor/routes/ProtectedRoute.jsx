import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./features/mentor/pages/Dashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mentor/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;