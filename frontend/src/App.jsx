import React from "react";
import {Routes, Route} from "react-router-dom";
import Transactions from "./pages/Transactions";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Transactions />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </div>
  )
}

export default App
