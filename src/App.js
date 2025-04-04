import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Dashboard from './components/dashboard';
import ThemeToggle from './components/themeToggle';
import Footer from './components/footer';
import { lightTheme, darkTheme } from './theme';
import logo from './logo.svg';
import './App.css';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  transition: background-color 0.3s, color 0.3s;
  padding-top: 60px; /* Add space for fixed navbar */
`;

const NavBar = styled.nav`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: ${props => props.theme.darkMode ? '#121212' : '#010217'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: background-color 0.3s;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 15px;
`;

const AppName = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: white;
  flex: 1;
  background: linear-gradient(135deg, #ffffff 0%, #b7c7e8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
`;

function App() {
  // Initialize theme state from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    // Save to localStorage whenever theme changes
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDataChange = () => {
    // No need to store data since we're not using it
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppContainer>
        <NavBar>
          <Logo src={logo} alt="Logo" />
          <AppName>SurfStash</AppName>
          <ToggleContainer>
            <ThemeToggle toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          </ToggleContainer>
        </NavBar>
        
        <ContentContainer>
          <Section>
            <Dashboard onDataChange={handleDataChange} />
          </Section>
        </ContentContainer>
        
        <Footer />
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;