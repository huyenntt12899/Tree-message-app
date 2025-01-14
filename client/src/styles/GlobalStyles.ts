import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: 'Arial', sans-serif;
    background-color: #f9f9f9;
    color: #333;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  ul {
    list-style: none;
  }
`;
