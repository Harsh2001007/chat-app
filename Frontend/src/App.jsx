import React from "react";
import Navbar from "./components/Navbar";
import { Router, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Navbar />
      <Router></Router>
    </div>
  );
};

export default App;
