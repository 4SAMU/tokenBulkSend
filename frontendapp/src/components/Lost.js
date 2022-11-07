/** @format */

import React from "react";
import { NavLink } from "react-router-dom";
import "../App.css";

const Lost = () => {
  return (
    <div>
      <h3>Your are Lost 😓</h3>
      <NavLink to={"/"}>
        <button className="sendBtn">Go back</button>
      </NavLink>
    </div>
  );
};

export default Lost;
