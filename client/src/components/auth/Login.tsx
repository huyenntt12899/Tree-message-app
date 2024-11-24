import React, { useState } from "react";
import styled from "styled-components";
import { login } from "../../apis/auth";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: (user: User) => void;
}

interface User {
  username: string;
  email: string;
}

const FormContainer = styled.div`
  width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;
const Checkbox = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const navigate = useNavigate();
  const userDataRemember = localStorage.getItem("rememberAccount");
  const [formData, setFormData] = useState({
    usernameOrEmail: userDataRemember
      ? JSON.parse(userDataRemember)?.username
      : "",
    password: "",
    isRememberMe: userDataRemember
      ? JSON.parse(userDataRemember)?.isRememberMe
      : false,
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(formData.usernameOrEmail, formData.password);
      if (response.status === 200) {
        setUser(response.data.user);
        if (formData.isRememberMe) {
          const dataAcc = {
            username: formData.usernameOrEmail,
            isRememberMe: formData.isRememberMe,
          };
          localStorage.setItem("rememberAccount", JSON.stringify(dataAcc));
        } else {
          localStorage.removeItem("rememberAccount");
        }
        localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/messages");
      }
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <FormContainer>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username or Email"
          value={formData.usernameOrEmail}
          onChange={(e) =>
            setFormData({ ...formData, usernameOrEmail: e.target.value })
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <label>
          <Checkbox
            type="checkbox"
            checked={formData.isRememberMe ?? false}
            onChange={(e) =>
              setFormData({ ...formData, isRememberMe: e.target.checked })
            }
          />
          Remember me
        </label>

        <Button type="submit">Login</Button>
      </form>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormContainer>
  );
};

export default Login;
