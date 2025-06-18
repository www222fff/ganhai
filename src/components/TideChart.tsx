import React from 'react';
import { Line } from 'react-chartjs-2';
import { TideData } from '../types/tide';

interface TideChartProps {
    data: TideData[];
}

function formatTime(timeStr: string) {
    const tIdx = timeStr.indexOf('T') !== -1 ? timeStr.indexOf('T') : timeStr.indexOf(' ');
    return tIdx !== -1 ? timeStr.slice(tIdx + 1) : timeStr;
}

function getDateStr(timeStr: string) {
    const tIdx = timeStr.indexOf('T') !== -1 ? timeStr.indexOf('T') : timeStr.indexOf(' ');
    return tIdx !== -1 ? timeStr.slice(0, tIdx) : timeStr;
}

const TideChart: React.FC<TideChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map(d => formatTime(d.time)),
        datasets: [
            {
                label: 'Tide Height (m)',
                data: data.map(d => d.height),
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.2)',
                fill: true,
                pointRadius: data.map(d => d.type ? 6 : 2),
                pointBackgroundColor: data.map(d => d.type === '高潮' ? 'red' : d.type === '低潮' ? 'green' : 'blue'),
            },
        ],
    };

    const options = {
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const idx = context.dataIndex;
                        const d = data[idx];
                        let label = `高度: ${d.height}m`;
                        if (d.type) label += ` (${d.type})`;
                        return label;
                    }
                }
            },
            legend: {
                display: true
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Height (m)',
                },
            },
        },
    };

    const dateStr = data.length > 0 ? getDateStr(data[0].time) : '';
    const extremaStr = data.filter(d => d.type).map((d, idx) => (
        <span key={idx} style={{ color: d.type === '高潮' ? 'red' : 'green', marginLeft: 8, fontWeight: 'bold' }}>
            {d.type} {formatTime(d.time)}
        </span>
    ));

    return (
        <div style={{ width: '66%', height: '320px', margin: '0 auto', position: 'relative' }}>
            {(dateStr || extremaStr.length > 0) && (
                <div style={{ position: 'absolute', top: 0, left: 0, fontWeight: 'bold', fontSize: '16px', background: 'rgba(255,255,255,0.8)', padding: '2px 8px', borderRadius: '0 0 8px 0', display: 'flex', alignItems: 'center' }}>
                    <span>{dateStr}</span>
                    {extremaStr}
                </div>
            )}
            <Line data={chartData} options={options} />
        </div>
    );
};

export default TideChart;