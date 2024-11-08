import React, { createContext, useState } from 'react';
import { Colors } from '../Utils/Style';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isGreenTheme, setIsGreenTheme] = useState(false);

  const toggleTheme = () => {
    setIsGreenTheme((prevTheme) => !prevTheme);
  };

  const theme = {
    backgroundColor: isGreenTheme ? Colors.background : Colors.toggleThemeBackground,
    textColor: isGreenTheme ? Colors.primary: Colors.toggleThemeHeader,
    headerColor: isGreenTheme ? Colors.primary : Colors.toggleThemeHeader,
    buttonColor: isGreenTheme ? Colors.primary : Colors.toggleThemeHeader,
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};