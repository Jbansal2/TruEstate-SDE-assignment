import React from "react";
import {Routes, Route} from "react-router-dom";
import Transactions from "./pages/Transactions";


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Transactions />} />
      </Routes>
    </div>
  )
}

export default App
