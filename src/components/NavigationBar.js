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
              <NavLink className="px-1 no-underline mr-2" exact to="/" activeClassName="border border-primary rounded">Home</NavLink>
              <NavLink className="px-1 no-underline" to="/create" activeClassName="border border-primary rounded">New</NavLink>
            </Nav>
          </Navbar.Collapse>
      </Navbar>
    );
};

export default NavigationBar;