import React, { useState } from "react";
import styled from "styled-components";
import { register } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
interface FormData {
  username: string;
  password: string;
  email: string;
}

interface ValidationErrors {
  username?: string;
  password?: string;
  email?: string;
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    email: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    const usernameRegex = /^[a-zA-Z0-9]{5,20}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!usernameRegex.test(formData.username)) {
      errors.username = "Username must be 5-20 characters and alphanumeric.";
    }

    if (!passwordRegex.test(formData.password)) {
      errors.password =
        "Password must be 8-20 characters, include upper/lowercase, a number, and a symbol.";
    }

    if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await register(
        formData.username,
        formData.email,
        formData.password
      );
      if (res.status === 201) {
        navigate("/login");
        alert("Registration successful!");
      }
    } catch (error) {
      alert("Registration failed.");
    }
  };

  return (
    <FormContainer>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
        />
        {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        <Button type="submit">Register</Button>
      </form>
    </FormContainer>
  );
};

export default Register;
