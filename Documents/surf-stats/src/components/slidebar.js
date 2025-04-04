// src/components/slidebar.js
import React from 'react';
import styled from 'styled-components';

// Transaction status colors for consistent usage across the app
export const TransactionColors = {
  completed: {
    primary: '#4caf50', // Green
    light: 'rgba(76, 175, 80, 0.15)',
    dark: 'rgba(76, 175, 80, 0.25)'
  },
  failed: {
    primary: '#f44336', // Red
    light: 'rgba(244, 67, 54, 0.15)',
    dark: 'rgba(244, 67, 54, 0.25)'
  },
  pending: {
    primary: '#ff9800', // Orange
    light: 'rgba(255, 152, 0, 0.15)',
    dark: 'rgba(255, 152, 0, 0.25)'
  }
};

const SidebarContainer = styled.div`
  background-color: ${props => props.theme.darkMode 
    ? 'linear-gradient(145deg, #0c0c14 0%, #1a1a24 100%)' 
    : props.theme.cardBg};
  background: ${props => props.theme.darkMode 
    ? 'linear-gradient(145deg, #0c0c14 0%, #1a1a24 100%)' 
    : props.theme.cardBg};
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: ${props => props.theme.darkMode 
    ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
    : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  max-width: 250px;
  width: 100%;
  border: ${props => props.theme.darkMode 
    ? '1px solid rgba(80, 80, 95, 0.2)' 
    : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.theme.darkMode 
      ? 'radial-gradient(circle at top right, rgba(58, 123, 213, 0.08), transparent 70%)' 
      : 'radial-gradient(circle at top right, rgba(69, 104, 220, 0.08), transparent 70%)'};
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 60px;
    background: ${props => props.theme.darkMode 
      ? 'radial-gradient(circle at bottom left, rgba(58, 123, 213, 0.08), transparent 70%)' 
      : 'radial-gradient(circle at bottom left, rgba(69, 104, 220, 0.08), transparent 70%)'};
    z-index: 1;
  }
`;

const SidebarContent = styled.div`
  position: relative;
  z-index: 2;
`;

const BlockDiagram = styled.div`
  position: absolute;
  top: 25px;
  right: 15px;
  width: 30px;
  height: 30px;
  opacity: 0.2;
  z-index: 1;
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${props => props.theme.darkMode ? '#3a7bd5' : '#4568dc'};
  }
  
  &::before {
    top: 0;
    left: 0;
    width: 15px;
    height: 15px;
  }
  
  &::after {
    bottom: 0;
    right: 0;
    width: 20px;
    height: 8px;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.textColor};
  letter-spacing: 0.3px;
`;

const PartnerSelect = styled.select`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid ${props => props.theme.backgroundColor === '#ffffff' ? '#e1e1e1' : '#343463'};
  border-radius: 6px;
  background-color: ${props => props.theme.backgroundColor === '#ffffff' ? '#ffffff' : '#1e1e38'};
  color: ${props => props.theme.textColor};
  font-size: 13px;
  margin-bottom: 0;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #4568dc;
    box-shadow: 0 0 0 2px rgba(69, 104, 220, 0.2);
  }

  option {
    background-color: ${props => props.theme.backgroundColor};
    color: ${props => props.theme.textColor};
  }
`;

const Sidebar = ({ partners, selectedPartner, onPartnerSelect }) => {
  // Handle partner selection
  const handleChange = (e) => {
    // Call the passed onPartnerSelect function
    onPartnerSelect(e.target.value);
  };
  
  return (
    <SidebarContainer>
      <BlockDiagram />
      <SidebarContent>
        <SidebarTitle>Filter by Partner</SidebarTitle>
        <PartnerSelect 
          value={selectedPartner || ''} 
          onChange={handleChange}
        >
          <option value="">All Partners</option>
          {partners && partners.map(partner => (
            <option key={partner.id} value={partner.id}>
              {partner.name} ({partner.orderCount || 0} orders)
            </option>
          ))}
        </PartnerSelect>
      </SidebarContent>
    </SidebarContainer>
  );
};

export default Sidebar;