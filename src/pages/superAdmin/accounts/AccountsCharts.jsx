import { useRef, useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = ({regionData}) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState({ datasets:regionData });

    useEffect(() => {
        const ctx = chartRef.current;

        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, '#FEFEFE');
        gradient.addColorStop(1, '#FFD700');
        gradient.addColorStop(1, '#FBEF81');
        setChartData({
            labels:regionData?.map((option)=>option.region),
            datasets: [
                {
                    label: 'Occupancy',
                    data:regionData?.map((option)=>option.percentage),
                    backgroundColor: gradient,
                    borderColor: '#FBEF81',
                    borderWidth: 1,
                       barThickness: 40,
                    
                }
            ]
        });
    }, [regionData]);

    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { beginAtZero: true },
        },
    };

    return (
        <Bar
            ref={(el) => {
                if (el) chartRef.current = el.canvas;
            }}
            data={chartData}
            options={options}
        />
    );
}

export const TotalSales = ({ totalSalesData }) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Filler,
        Tooltip,
        Legend
    );
    //console.log("totalSales", totalSalesData);
    const data = {
        labels: totalSalesData?.monthly_sales?.map(item => item.month), // extract months
        datasets: [
            {
                label: 'Revenue',
                data:totalSalesData?.monthly_sales?.map(item => item.total_sales),
                fill: true,
                backgroundColor: '#F6DE0480',
                borderColor: '#B6A70B',
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        scales: {
            y: {

                ticks: {
                    callback: (value) => `$${value.toLocaleString()}`
                },
                title: {
                    display: true,
                    text: 'Revenue'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Month'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    };

    return (
        <>
            <Line data={data} options={options} />
        </>
    )
}
