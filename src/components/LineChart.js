import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const LineChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Number of Jobs',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    Papa.parse('/salaries.csv', {
      download: true,
      header: true,
      complete: (results) => {
        console.log('Parsed data for chart:', results); // Log the parsed data

        if (results && results.data) {
          const aggregatedData = results.data.reduce((acc, row) => {
            const year = row.work_year;
            if (!acc[year]) {
              acc[year] = 0;
            }
            acc[year] += 1;
            return acc;
          }, {});

          console.log('Aggregated data for chart:', aggregatedData); // Log the aggregated data

          const years = Object.keys(aggregatedData).sort();
          const jobCounts = years.map(year => aggregatedData[year]);

          setChartData({
            labels: years,
            datasets: [
              {
                label: 'Number of Jobs',
                data: jobCounts,
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
              },
            ],
          });
        }
      },
      error: (err) => {
        console.error('Error parsing CSV for chart:', err);
      }
    });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Number of Jobs Over Time</h2>
      {chartData.labels.length > 0 ? (
        <Line data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default LineChart;
