// src/components/statusStats.js
import React from 'react';
import styled from 'styled-components';

const StatusContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const StatusCard = styled.div`
  background-color: ${props => props.theme.darkMode ? 
    'rgba(30, 30, 60, 0.7)' : 
    props.theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${props => props.theme.darkMode ? 
    '0 4px 15px rgba(0, 0, 0, 0.3)' : 
    '0 4px 8px rgba(0, 0, 0, 0.1)'};
  border-left: 5px solid ${props => 
    props.status === 'completed' ? '#4caf50' : 
    props.status === 'cancelled' ? '#f44336' : '#ff9800'};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.darkMode ? 
    'rgba(60, 60, 130, 0.3)' : 
    'rgba(230, 235, 245, 0.6)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 150px;
    background: ${props => 
      props.status === 'completed' ? 
        `radial-gradient(circle at top right, ${props.theme.darkMode ? 'rgba(76, 175, 80, 0.25)' : 'rgba(76, 175, 80, 0.15)'}, transparent 70%)` : 
      props.status === 'cancelled' ? 
        `radial-gradient(circle at top right, ${props.theme.darkMode ? 'rgba(244, 67, 54, 0.25)' : 'rgba(244, 67, 54, 0.15)'}, transparent 70%)` : 
        `radial-gradient(circle at top right, ${props.theme.darkMode ? 'rgba(255, 152, 0, 0.25)' : 'rgba(255, 152, 0, 0.15)'}, transparent 70%)`};
    border-radius: 50%;
    z-index: 0;
  }
`;

const StatusTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.textColor};
  position: relative;
  z-index: 1;
  letter-spacing: 0.5px;
  text-transform: capitalize;
  ${props => props.theme.darkMode && `
    background: linear-gradient(135deg, #ffffff 0%, #e0e0ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;

const StatusStat = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  position: relative;
  z-index: 1;
`;

const StatLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme.textColor};
  opacity: 0.85;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.textColor};
  background: ${props => props.highlight ? 
    'linear-gradient(135deg, #4568dc, #b06ab3)' : 'none'};
  -webkit-background-clip: ${props => props.highlight ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.highlight ? 'transparent' : 'inherit'};
`;

const SummaryContainer = styled.div`
  grid-column: 1 / -1;
  background-color: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-top: 3px solid ${props => 
    `linear-gradient(to right, #4caf50, #f44336, #ff9800)`};
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 15px;
  color: ${props => props.theme.textColor};
  letter-spacing: 0.5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, #4568dc, #b06ab3);
    border-radius: 3px;
  }
`;

const PercentageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const PercentageItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StatusLabel = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
`;

const PercentageValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${props => 
    props.status === 'completed' ? '#4caf50' : 
    props.status === 'cancelled' ? '#f44336' : 
    props.status === 'pending' ? '#ff9800' : 
    props.theme.textColor};
`;

const TotalTransactions = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-top: 5px;
  color: ${props => props.theme.textColor};
  opacity: 0.9;
`;

const StatusStats = ({ data }) => {
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
    
  // Calculate percentages for each status
  const completedPercentage = totalOrders ? 
    ((aggregatedData.totalSuccessfulOrders / totalOrders) * 100).toFixed(1) : '0.0';
  
  const cancelledPercentage = totalOrders ? 
    ((aggregatedData.totalFailedOrders / totalOrders) * 100).toFixed(1) : '0.0';
  
  const pendingPercentage = totalOrders ? 
    ((aggregatedData.totalPendingOrders / totalOrders) * 100).toFixed(1) : '0.0';
  
  return (
    <StatusContainer>
      <StatusCard status="completed">
        <StatusTitle>Completed Transactions</StatusTitle>
        <StatusStat>
          <StatLabel>Orders</StatLabel>
          <StatValue highlight>{aggregatedData.totalSuccessfulOrders}</StatValue>
        </StatusStat>
        <StatusStat>
          <StatLabel>Retry Attempts</StatLabel>
          <StatValue>{aggregatedData.totalSuccessfulAttempts}</StatValue>
        </StatusStat>
      </StatusCard>
      
      <StatusCard status="cancelled">
        <StatusTitle>Cancelled Transactions</StatusTitle>
        <StatusStat>
          <StatLabel>Orders</StatLabel>
          <StatValue highlight>{aggregatedData.totalFailedOrders}</StatValue>
        </StatusStat>
        <StatusStat>
          <StatLabel>Retry Attempts</StatLabel>
          <StatValue>{aggregatedData.totalFailedAttempts}</StatValue>
        </StatusStat>
      </StatusCard>
      
      <StatusCard status="pending">
        <StatusTitle>Pending Transactions</StatusTitle>
        <StatusStat>
          <StatLabel>Orders</StatLabel>
          <StatValue highlight>{aggregatedData.totalPendingOrders}</StatValue>
        </StatusStat>
        <StatusStat>
          <StatLabel>Retry Attempts</StatLabel>
          <StatValue>{aggregatedData.totalPendingAttempts}</StatValue>
        </StatusStat>
      </StatusCard>
      
      <SummaryContainer>
        <SummaryTitle>Transaction Distribution</SummaryTitle>
        <TotalTransactions>Total Transactions: {totalOrders}</TotalTransactions>
        
        <PercentageGrid>
          <PercentageItem>
            <StatusLabel>Completed</StatusLabel>
            <PercentageValue status="completed">{completedPercentage}%</PercentageValue>
          </PercentageItem>
          
          <PercentageItem>
            <StatusLabel>Cancelled</StatusLabel>
            <PercentageValue status="cancelled">{cancelledPercentage}%</PercentageValue>
          </PercentageItem>
          
          <PercentageItem>
            <StatusLabel>Pending</StatusLabel>
            <PercentageValue status="pending">{pendingPercentage}%</PercentageValue>
          </PercentageItem>
        </PercentageGrid>
      </SummaryContainer>
    </StatusContainer>
  );
};

export default StatusStats;