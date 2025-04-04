import React from 'react';
import styled from 'styled-components';
import sbLogo from '../sb-logo.png'; 

const FooterContainer = styled.footer`
  width: 100%;
  padding: 2.5rem 2rem 1.5rem;
  font-family: 'IBM Plex Sans', sans-serif;
  transition: all 0.3s ease;
  background-color: ${props => props.theme.darkMode ? '#020b2c' : '#03103f'};
  color: rgba(255, 255, 255, 0.9);
`;

const PoweredBySection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PoweredByText = styled.span`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  color: rgba(255, 255, 255, 0.7);
`;

const SurfboardLogo = styled.img`
  height: 24px;
  margin: 0 0.5rem;
  vertical-align: middle;
  filter: brightness(1.1);
  transition: filter 0.2s ease;
`;

const SurfboardLink = styled.a`
  color: white;
  font-weight: 700;
  margin-left: 0.5rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.8;
    
    ${SurfboardLogo} {
      filter: brightness(1.3);
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Copyright = styled.p`
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.2px;
  font-weight: 300;
  margin: 0;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <PoweredBySection>
        <PoweredByText>Powered by</PoweredByText>
        <SurfboardLink 
          href="https://www.surfboardpayments.com"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <SurfboardLogo src={sbLogo} alt="Surfboard Payments Logo" />
          Surfboard Payments
        </SurfboardLink>
      </PoweredBySection>
      
      <FooterBottom>
        <Copyright>
          Copyright 2019-2025 Surfboard Payments AB. Headquarters: Stockholm, Sweden. All rights reserved.<br />
          Barnhusgatan 4, 111 23 Stockholm. Organization number: 559214-0437
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;