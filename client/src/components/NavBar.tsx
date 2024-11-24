import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { User } from "../App";

interface NavbarProps {
  user: { username: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const NavbarContainer = styled.nav`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  a {
    margin: 0 10px;
    color: white;
    font-weight: bold;
  }
`;

const Button = styled.button`
  color: white;
  margin: 0 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  cursor: pointer;

  background: black;

  &:hover {
    background: #45a049;
  }
`;

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => (
  <NavbarContainer>
    <div>
      <h2>Message App</h2>
    </div>
    <NavLinks>
      {user ? (
        <>
          <span>
            {user.username} ({user.email})
          </span>
          <Button
            onClick={() => {
              localStorage.removeItem("userData");
              setUser(null);
            }}
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link to="/messages">Messages</Link>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </NavLinks>
  </NavbarContainer>
);

export default Navbar;
