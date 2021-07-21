import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const NavigationBar = () => {
    return (
        <Navbar bg="light" variant="light">
          <NavLink to="/" className="navbar-brand">
            Victor-Spoilz
          </NavLink>
          <Navbar.Collapse className="justify-content-left">
            <Nav className="me-auto">
              <NavLink className="mr-2" to="/">Home</NavLink>
              <NavLink to="/create">New</NavLink>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
    );
};

export default NavigationBar;