import React from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function ChartBar({ collection, fuelconsumtion, revenew }) {
  console.log(collection, fuelconsumtion);

  return (
    <div className='m-5' style={{ width: '450px', height: '250px' }}>
      <Bar
        width={350}
        height={300}
        data={{
          labels: ['October 2024'],
          datasets: [
            {
              label: 'Expense',
              data: [fuelconsumtion],
              // data:fuelconsumtion,
              backgroundColor:'#0d8a72',
              borderColor: 'rgba(255, 99, 132, 1)',
              // backgroundColor: [
              //   '#0d8a72',
              //   ' #37bc7f',
              //   ' #ffb94d',
              //   // 'rgba(75, 192, 192, 0.2)',
              //   // 'rgba(153, 102, 255, 0.2)',
              //   // 'rgba(255, 159, 64, 0.2)',
              // ],
              // borderColor: [
              //   'rgba(255, 99, 132, 1)',
              //   'rgba(54, 162, 235, 1)',
              //   'rgba(255, 206, 86, 1)',
              //   // 'rgba(75, 192, 192, 1)',
              //   // 'rgba(153, 102, 255, 1)',
              //   // 'rgba(255, 159, 64, 1)',
              // ],
              borderWidth: 1,
            },
            {
              label: 'Collection',
              data: [collection],
              backgroundColor: ' #37bc7f',
              borderColor: 'rgba(54, 162, 235, 1)',
            },
            {
              label: 'Remunaration',
              data: [collection-fuelconsumtion],
              backgroundColor:  ' #ffb94d',
              borderColor:  'rgba(255, 206, 86, 1)',
              borderWidth: 1,
            }
          ],

        }}
        options={{
          responsive: true,

        }}
      />



    </div>
  )
}

export default ChartBar