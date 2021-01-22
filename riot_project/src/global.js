import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  html, body, #root{
    margin: 0;
    padding: 0;    
  }

  `;
