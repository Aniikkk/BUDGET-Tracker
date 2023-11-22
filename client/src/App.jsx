import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./styles/styles.css";

import Navbar from "./components/Navbar.jsx";
import Home from "./routes/Home";
import Create from "./routes/Create";
import Budget from "./routes/Budget";
import NoPage from "./routes/NoPage";

function Layout() {
  return (
    <div className="content">
      <Navbar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/budget/:id" element={<Budget />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
