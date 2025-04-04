// src/components/partnerStats.js
import React from 'react';
import styled from 'styled-components';

const PartnerStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PartnerCard = styled.div`
  background-color: ${props => props.theme.cardBg};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const PartnerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(150, 150, 150, 0.1);
`;

const PartnerName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textColor};
  letter-spacing: 0.5px;
  text-transform: capitalize;
`;

const PartnerID = styled.span`
  font-size: 12px;
  color: ${props => props.theme.textColor};
  opacity: 0.6;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 13px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  margin-bottom: 5px;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
  background: ${props => props.highlight ? 
    'linear-gradient(135deg, #4568dc, #b06ab3)' : 'none'};
  -webkit-background-clip: ${props => props.highlight ? 'text' : 'none'};
  -webkit-text-fill-color: ${props => props.highlight ? 'transparent' : 'inherit'};
`;

const NoPartnerData = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  font-style: italic;
`;

const PartnerStats = ({ data }) => {
  if (!data || !data.data || data.data.length === 0) {
    return <NoPartnerData>No partner data available</NoPartnerData>;
  }
  
  return (
    <PartnerStatsContainer>
      {data.data.map((partner) => {
        // Skip partners without a name
        if (!partner.partnerName) return null;
        
        const totalOrders = 
          (partner.noOfSuccessfulOrders || 0) + 
          (partner.noOfFailedOrders || 0) + 
          (partner.noOfPendingOrders || 0);
          
        const totalAttempts = 
          (partner.noOfSuccessfulAttempts || 0) + 
          (partner.noOfFailedAttempts || 0) + 
          (partner.noOfPendingAttempts || 0);
        
        return (
          <PartnerCard key={partner.partnerId}>
            <PartnerHeader>
              <PartnerName>{partner.partnerName}</PartnerName>
              <PartnerID>{partner.partnerId}</PartnerID>
            </PartnerHeader>
            <StatGrid>
              <StatItem>
                <StatLabel>Total Orders</StatLabel>
                <StatValue>{totalOrders}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Total Attempts</StatLabel>
                <StatValue highlight>{totalAttempts}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Successful Orders</StatLabel>
                <StatValue>{partner.noOfSuccessfulOrders || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Failed Orders</StatLabel>
                <StatValue>{partner.noOfFailedOrders || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Pending Orders</StatLabel>
                <StatValue>{partner.noOfPendingOrders || 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>Success Rate</StatLabel>
                <StatValue>
                  {totalOrders ? ((partner.noOfSuccessfulOrders || 0) / totalOrders * 100).toFixed(1) : 0}%
                </StatValue>
              </StatItem>
            </StatGrid>
          </PartnerCard>
        );
      })}
    </PartnerStatsContainer>
  );
};

export default PartnerStats;