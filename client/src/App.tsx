import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styled from "styled-components";
import Navbar from "./components/NavBar";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import MessageBoard from "./components/messages/MessageBoard";

export interface User {
  username: string;
  email: string;
}

const AppContainer = styled.div`
  font-family: Arial, sans-serif;
`;

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      console.log(JSON.parse(storedUser)?.user);
      setUser(JSON.parse(storedUser)?.user);
    }
  }, []);

  return (
    <Router>
      <AppContainer>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/messages" element={<MessageBoard user={user} />} />
          <Route path="/messages/:id" element={<MessageBoard user={user} />} />
          <Route path="/" element={<MessageBoard user={user} />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;
