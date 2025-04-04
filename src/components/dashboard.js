// src/components/dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { decodeBase64Data } from '../utils/decodeData';
import StatusStats from './statusStats';
import RetryChart from './retryChart';
import Sidebar from './slidebar';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  min-height: 100vh;
  max-width: 100%;
  padding: 0;
  overflow-x: hidden;
  background: ${props => props.theme.darkMode ? 
    'linear-gradient(135deg, #0c0c14 0%, #151520 100%)' : 
    props.theme.backgroundColor};
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: ${props => props.theme.darkMode
    ? 'linear-gradient(to right, rgba(26, 32, 58, 0.8), rgba(14, 8, 48, 0.9))' 
    : 'linear-gradient(to right, rgba(245, 247, 250, 0.95), rgba(230, 235, 245, 0.9))'};
  padding: 16px 24px;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.darkMode ? 'rgba(60, 60, 130, 0.3)' : 'rgba(230, 235, 245, 0.6)'};
  width: 100%;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #4568dc, #b06ab3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const DateDisplay = styled.div`
  font-size: 16px;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
  font-weight: 500;
  letter-spacing: 0.5px;
  background-color: ${props => props.theme.cardBg};
  padding: 6px 12px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ErrorBox = styled.div`
  background-color: ${props => props.theme.cardBg};
  padding: 15px;
  border: 1px solid ${props => props.theme.backgroundColor === '#ffffff' ? '#e1e1e1' : '#343463'};
  border-radius: 8px;
  width: 100%;
`;

const ErrorMessage = styled.p`
  color: #f44336;
  margin: 0;
  font-weight: 500;
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const Dashboard = ({ onDataChange }) => {
  const [decodedData, setDecodedData] = useState(null);
  const [orderDate, setOrderDate] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [allPartners, setAllPartners] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get base64 data from URL query parameter
    const handleDecode = () => {
      try {
        const queryParams = new URLSearchParams(window.location.search);
        const base64Data = queryParams.get('data');
        
        if (!base64Data) {
          setError('No data provided in URL. Please add a "data" parameter.');
          return;
        }
        
        const data = decodeBase64Data(base64Data);
        
        if (!data || !data.data || !Array.isArray(data.data)) {
          setError('Invalid data format. Expected an array of data objects.');
          return;
        }
        
        setDecodedData(data);
        
        if (data.data.length > 0) {
          setOrderDate(data.data[0].date || 'Not Available');
          
          // Extract unique partners from the data
          const partners = Array.from(
            new Map(
              data.data.map(item => {
                return [
                  item.partnerId, 
                  { 
                    id: item.partnerId, 
                    name: item.partnerName,
                    orderCount: calculatePartnerOrderCount(data.data, item.partnerId)
                  }
                ];
              })
            ).values()
          );
          
          setAllPartners(partners);
        }
        
        // Call the onDataChange prop with the decoded data
        if (onDataChange) {
          onDataChange(data);
        }
      } catch (err) {
        console.error('Error decoding data:', err);
        setError(`Error decoding data: ${err.message}`);
      }
    };
    
    const calculatePartnerOrderCount = (data, partnerId) => {
      return data
        .filter(item => item.partnerId === partnerId)
        .reduce((total, item) => {
          return total + 
            (item.noOfSuccessfulOrders || 0) + 
            (item.noOfFailedOrders || 0) + 
            (item.noOfPendingOrders || 0);
        }, 0);
    };
    
    handleDecode();
  }, [onDataChange]);

  // Handle partner filtering
  const handlePartnerSelect = (partnerId) => {
    setSelectedPartner(partnerId);
  };

  // Properly filter data based on selected partner
  let filteredData = null;
  if (decodedData && decodedData.data) {
    const filtered = selectedPartner 
      ? decodedData.data.filter(item => item.partnerId === selectedPartner) 
      : decodedData.data;
    
    filteredData = { data: filtered };
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <Title>SurfStats for Online Transactions</Title>
        {orderDate && <DateDisplay>{orderDate}</DateDisplay>}
      </DashboardHeader>
      
      {error && (
        <ErrorBox>
          <ErrorMessage>{error}</ErrorMessage>
        </ErrorBox>
      )}
      
      {decodedData && decodedData.data && (
        <DashboardContent>
          <Sidebar
            partners={allPartners}
            onPartnerSelect={handlePartnerSelect}
            selectedPartner={selectedPartner}
          />
          
          <StatusStats data={filteredData} />
          <RetryChart 
            data={filteredData} 
            selectedPartner={selectedPartner}
          />
        </DashboardContent>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;