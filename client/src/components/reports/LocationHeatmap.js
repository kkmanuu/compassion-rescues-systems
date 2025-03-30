import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement);

const LocationHeatmap = ({ locations }) => {
  const chartData = {
    labels: locations.map(loc => loc.location),
    datasets: [
      {
        label: 'Cases by Location',
        data: locations.map(loc => loc.count),
        backgroundColor: '#36A2EB'
      }
    ]
  };

  return <Bar data={chartData} />;
};

export default LocationHeatmap;