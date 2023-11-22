import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import "../styles/Navbar.css";

function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-left">
        <img src={logo} alt="logo" className="logo-img" />
        <h1 className="title">BUDGET THING</h1>
      </div>
      <div className="nav-right">
        <Link to="/create">
          <h1>Create</h1>
        </Link>
        <Link to="/">
          <h1>Home</h1>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
