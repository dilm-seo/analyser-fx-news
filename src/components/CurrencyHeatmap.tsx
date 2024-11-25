import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Currency } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CurrencyHeatmapProps {
  currencies: Currency[];
}

export default function CurrencyHeatmap({ currencies }: CurrencyHeatmapProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Currency Strength Heatmap',
      },
    },
  };

  const data = {
    labels: currencies.map(c => c.pair),
    datasets: [
      {
        label: 'Sentiment Score',
        data: currencies.map(c => c.sentiment),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Strength Index',
        data: currencies.map(c => c.strength),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line options={options} data={data} />
    </div>
  );
}