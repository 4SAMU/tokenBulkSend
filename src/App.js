/** @format */

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Send from "./components/Send";
import "./App.css";
import Lost from "./components/Lost";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/send" element={<Send />} />
        <Route path="*" element={<Lost />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
