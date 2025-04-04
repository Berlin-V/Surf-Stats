// src/components/statBlock.js
import React from 'react';
import styled from 'styled-components';

const StatBlockContainer = styled.div`
  background-color: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, 
      ${props => props.type === 'success' ? '#4caf50' : 
      props.type === 'failure' ? '#f44336' : 
      props.type === 'pending' ? '#ff9800' : '#2196f3'});
  }
`;

const StatTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
  color: ${props => props.theme.textColor};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const StatValue = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  margin-bottom: 5px;
  font-weight: 500;
`;

const Value = styled.span`
  font-size: ${props => props.large ? '32px' : '24px'};
  font-weight: 700;
  background: ${props => props.gradient ? 
    'linear-gradient(135deg, #4568dc, #b06ab3)' : 'none'};
  -webkit-background-clip: ${props => props.gradient ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.gradient ? 'transparent' : 'inherit'};
  color: ${props => !props.gradient ? props.theme.textColor : 'inherit'};
`;

const StatBlock = ({ title, data, type }) => {
  if (!data || !data.data) return null;
  
  // Aggregate data across all partners
  const aggregatedData = data.data.reduce(
    (acc, item) => {
      acc.totalSuccessfulOrders += item.noOfSuccessfulOrders || 0;
      acc.totalFailedOrders += item.noOfFailedOrders || 0;
      acc.totalPendingOrders += item.noOfPendingOrders || 0;
      acc.totalSuccessfulAttempts += item.noOfSuccessfulAttempts || 0;
      acc.totalFailedAttempts += item.noOfFailedAttempts || 0;
      acc.totalPendingAttempts += item.noOfPendingAttempts || 0;
      return acc;
    },
    {
      totalSuccessfulOrders: 0,
      totalFailedOrders: 0,
      totalPendingOrders: 0,
      totalSuccessfulAttempts: 0,
      totalFailedAttempts: 0,
      totalPendingAttempts: 0,
    }
  );
  
  const totalOrders = 
    aggregatedData.totalSuccessfulOrders + 
    aggregatedData.totalFailedOrders + 
    aggregatedData.totalPendingOrders;
    
  const totalAttempts = 
    aggregatedData.totalSuccessfulAttempts + 
    aggregatedData.totalFailedAttempts + 
    aggregatedData.totalPendingAttempts;
  
  const successRate = totalOrders ? 
    ((aggregatedData.totalSuccessfulOrders / totalOrders) * 100).toFixed(1) : '0.0';
  
  return (
    <StatBlockContainer type={type}>
      <StatTitle>{title}</StatTitle>
      <StatGrid>
        <StatValue>
          <StatLabel>Successful Orders</StatLabel>
          <Value gradient>{aggregatedData.totalSuccessfulOrders}</Value>
        </StatValue>
        
        <StatValue>
          <StatLabel>Failed Orders</StatLabel>
          <Value>{aggregatedData.totalFailedOrders}</Value>
        </StatValue>
        
        <StatValue>
          <StatLabel>Pending Orders</StatLabel>
          <Value>{aggregatedData.totalPendingOrders}</Value>
        </StatValue>
        
        <StatValue>
          <StatLabel>Success Rate</StatLabel>
          <Value>{successRate}%</Value>
        </StatValue>
      </StatGrid>
    </StatBlockContainer>
  );
};

export default StatBlock;