// src/components/themeToggle.js
import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

// Simplified toggle button
const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.isDarkMode ? '#121212' : '#f5f5f5'};
  color: ${props => props.isDarkMode ? 'white' : 'black'};
  width: 70px;
  height: 34px;
  border-radius: 17px;
  padding: 0 5px;
  cursor: pointer;
  position: relative;
  border: 2px solid ${props => props.isDarkMode ? '#343463' : '#e1e1e1'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  overflow: hidden;
`;

const SliderCircle = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isDarkMode ? 'calc(100% - 30px)' : '2px'};
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${props => props.isDarkMode ? '#b06ab3' : '#f39c12'};
  transition: left 0.3s ease;
  z-index: 1;
`;

const Icon = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
  color: ${props => props.active ? 
    (props.type === 'sun' ? '#f39c12' : 'white') : 
    'rgba(0, 0, 0, 0.3)'};
`;

const ThemeToggle = ({ toggleTheme, isDarkMode }) => {
  return (
    <ToggleButton 
      onClick={toggleTheme} 
      isDarkMode={isDarkMode}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Icon type="sun" active={!isDarkMode}>
        <FontAwesomeIcon icon={faSun} />
      </Icon>
      <Icon type="moon" active={isDarkMode}>
        <FontAwesomeIcon icon={faMoon} />
      </Icon>
      <SliderCircle isDarkMode={isDarkMode} />
    </ToggleButton>
  );
};

export default ThemeToggle;