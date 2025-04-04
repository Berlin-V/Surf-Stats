// src/components/retryChart.js
import React, { useEffect, useState, useCallback } from 'react';
import styled, { useTheme } from 'styled-components';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  background-color: ${props => props.theme.darkMode ? 
    'rgba(30, 30, 60, 0.7)' : 
    props.theme.cardBg};
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  box-shadow: ${props => props.theme.darkMode ? 
    '0 4px 15px rgba(0, 0, 0, 0.3)' : 
    '0 4px 8px rgba(0, 0, 0, 0.1)'};
  margin-top: 20px;
  border: 1px solid ${props => props.theme.darkMode ? 
    'rgba(60, 60, 130, 0.3)' : 
    'rgba(230, 235, 245, 0.6)'};
`;

const ChartTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.textColor};
  letter-spacing: 0.5px;
  ${props => props.theme.darkMode && `
    background: linear-gradient(135deg, #ffffff 0%, #e0e0ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;

const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
  border-top: 1px solid ${props => props.theme.darkMode ? 
    'rgba(255, 255, 255, 0.1)' : 
    '#e1e1e1'};
  padding-top: 15px;
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SummaryLabel = styled.span`
  font-size: 14px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  margin-bottom: 5px;
`;

const SummaryValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.textColor};
  
  ${props => props.highlight && `
    background: linear-gradient(135deg, ${props.theme.darkMode ? '#4568dc' : '#4568dc'}, ${props.theme.darkMode ? '#0e0830' : '#b06ab3'});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}
`;

const RetryChart = ({ data, selectedPartner }) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalVolume: 0,
    totalCompleted: 0,
    totalCancelled: 0,
    totalPending: 0,
    completionRate: '0.0'
  });
  // Keep track of top partners for axis labels
  const [topPartners, setTopPartners] = useState([]);

  const prepareChartData = useCallback((transactions) => {
    // Clear previous state
    let topPartnersData = [];
    
    if (selectedPartner) {
      // Selected partner view - show status breakdown for just this partner
      const filteredTransactions = transactions.filter(
        item => (item.partner_id === selectedPartner || item.partnerId === selectedPartner)
      );
      
      const totalCompleted = filteredTransactions.reduce(
        (total, item) => total + (item.noOfSuccessfulOrders || 0), 0
      );
      const totalCancelled = filteredTransactions.reduce(
        (total, item) => total + (item.noOfFailedOrders || 0), 0
      );
      const totalPending = filteredTransactions.reduce(
        (total, item) => total + (item.noOfPendingOrders || 0), 0
      );
      
      const totalVolume = totalCompleted + totalCancelled + totalPending;
      const completionRate = totalVolume ? ((totalCompleted / totalVolume) * 100).toFixed(1) : '0.0';
      
      // Status breakdown chart for selected partner
      const chartData = {
        labels: ['Completed', 'Cancelled', 'Pending'],
        datasets: [
          {
            label: 'Transactions',
            data: [totalCompleted, totalCancelled, totalPending],
            backgroundColor: [
              'rgba(76, 175, 80, 0.7)',  // green for completed
              'rgba(244, 67, 54, 0.7)',  // red for cancelled
              'rgba(255, 152, 0, 0.7)'   // orange for pending
            ],
            borderColor: [
              'rgba(76, 175, 80, 1)',
              'rgba(244, 67, 54, 1)',
              'rgba(255, 152, 0, 1)'
            ],
            borderWidth: 1
          }
        ]
      };
      
      setChartData(chartData);
      setSummaryData({
        totalVolume,
        totalCompleted,
        totalCancelled,
        totalPending,
        completionRate
      });
      // Clear top partners when in single partner view
      setTopPartners([]);
    } else {
      // Overall view - group by partner
      // Get unique partners - handle both partner_id and partnerId formats
      const partners = [...new Set(transactions.map(item => item.partner_id || item.partnerId))].filter(Boolean);
      
      // Create partner summaries
      const partnerData = partners.map(partnerId => {
        const partnerTransactions = transactions.filter(
          item => (item.partner_id === partnerId || item.partnerId === partnerId)
        );
        
        // Get partner name if available
        const partnerName = partnerTransactions[0]?.partnerName || '';
        const displayName = partnerName ? `${partnerName}\n(${partnerId})` : partnerId;
        
        const completed = partnerTransactions.reduce(
          (total, item) => total + (item.noOfSuccessfulOrders || 0), 0
        );
        const cancelled = partnerTransactions.reduce(
          (total, item) => total + (item.noOfFailedOrders || 0), 0
        );
        const pending = partnerTransactions.reduce(
          (total, item) => total + (item.noOfPendingOrders || 0), 0
        );
        
        return {
          partnerId,
          partnerName,
          displayName,
          completed,
          cancelled,
          pending,
          total: completed + cancelled + pending
        };
      });
      
      // Only include partners with actual data
      const filteredPartnerData = partnerData.filter(p => p.total > 0);
      
      // Sort by total volume descending
      filteredPartnerData.sort((a, b) => b.total - a.total);
      
      // Store the top partners for use in the axis labels
      topPartnersData = filteredPartnerData.slice(0, 10);
      setTopPartners(topPartnersData);
      
      // Prepare the stacked bar chart data by partner (limited to top 10 for clarity)
      const chartData = {
        // Just use simple identifiers for labels, we'll format them in the axis callback
        labels: topPartnersData.map((p, index) => `partner-${index}`),
        datasets: [
          {
            label: 'Completed',
            data: topPartnersData.map(p => p.completed),
            backgroundColor: 'rgba(76, 175, 80, 0.7)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 1
          },
          {
            label: 'Cancelled',
            data: topPartnersData.map(p => p.cancelled),
            backgroundColor: 'rgba(244, 67, 54, 0.7)',
            borderColor: 'rgba(244, 67, 54, 1)',
            borderWidth: 1
          },
          {
            label: 'Pending',
            data: topPartnersData.map(p => p.pending),
            backgroundColor: 'rgba(255, 152, 0, 0.7)',
            borderColor: 'rgba(255, 152, 0, 1)',
            borderWidth: 1
          }
        ]
      };
      
      // Calculate totals for summary
      const totalCompleted = filteredPartnerData.reduce((sum, p) => sum + p.completed, 0);
      const totalCancelled = filteredPartnerData.reduce((sum, p) => sum + p.cancelled, 0); 
      const totalPending = filteredPartnerData.reduce((sum, p) => sum + p.pending, 0);
      const totalVolume = totalCompleted + totalCancelled + totalPending;
      const completionRate = totalVolume ? ((totalCompleted / totalVolume) * 100).toFixed(1) : '0.0';
      
      setChartData(chartData);
      setSummaryData({
        totalVolume,
        totalCompleted,
        totalCancelled,
        totalPending,
        completionRate
      });
    }
  }, [selectedPartner]);

  useEffect(() => {
    if (data && data.data) {
      prepareChartData(data.data);
    }
  }, [data, selectedPartner, prepareChartData]);

  const options = React.useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: theme.textColor
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: theme.darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: theme.textColor,
        bodyColor: theme.textColor,
        borderColor: theme.borderColor,
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme.textColor,
          callback: function(value, index) {
            if (topPartners && index < topPartners.length) {
              const partner = topPartners[index];
              // Return an array of strings for multiline labels
              return [
                partner.partnerName || 'Unknown',
                `(${partner.partnerId})`
              ];
            }
            return value;
          }
        },
        stacked: !selectedPartner
      },
      y: {
        grid: {
          color: theme.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: theme.textColor
        },
        stacked: !selectedPartner
      }
    }
  }), [theme, topPartners, selectedPartner]);

  return (
    <ChartContainer>
      <ChartTitle>
        {selectedPartner 
          ? `Transaction Statistics for ${data?.data.find(item => (item.partner_id === selectedPartner || item.partnerId === selectedPartner))?.partnerName || selectedPartner}` 
          : `Transaction Statistics by Partner`}
      </ChartTitle>
      
      {chartData && (
        <>
          <div style={{ height: '300px' }}>
            <Bar data={chartData} options={options} />
          </div>
          
          <SummaryContainer>
            <SummaryItem>
              <SummaryLabel>Total Transactions</SummaryLabel>
              <SummaryValue>{summaryData.totalVolume} orders</SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Completed</SummaryLabel>
              <SummaryValue highlight>{summaryData.totalCompleted} orders</SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Cancelled</SummaryLabel>
              <SummaryValue>{summaryData.totalCancelled} orders</SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Pending</SummaryLabel>
              <SummaryValue>{summaryData.totalPending} orders</SummaryValue>
            </SummaryItem>
          </SummaryContainer>
        </>
      )}
    </ChartContainer>
  );
};

export default RetryChart;