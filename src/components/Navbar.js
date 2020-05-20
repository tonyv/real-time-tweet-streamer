import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="three wide column">
      <div className="ui vertical pointing menu">
        <NavLink to="/tweets" className="item">
          New Tweets
        </NavLink>
        <NavLink to="/rules" className="item">
          Manage Rules
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
