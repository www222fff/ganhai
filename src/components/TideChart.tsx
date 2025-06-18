import React from 'react';
import { Line } from 'react-chartjs-2';
import { TideData } from '../types/tide';

interface TideChartProps {
    data: TideData[];
    date?: string;     // 新增：日期
}

function formatTime(timeStr: string) {
    const tIdx = timeStr.indexOf('T') !== -1 ? timeStr.indexOf('T') : timeStr.indexOf(' ');
    return tIdx !== -1 ? timeStr.slice(tIdx + 1) : timeStr;
}

function getDateStr(timeStr: string) {
    const tIdx = timeStr.indexOf('T') !== -1 ? timeStr.indexOf('T') : timeStr.indexOf(' ');
    return tIdx !== -1 ? timeStr.slice(0, tIdx) : timeStr;
}

const TideChart: React.FC<TideChartProps> = ({ data, date }) => {
    // 提取所有高潮和低潮时间
    const highTides = data.filter(d => d.type === '高潮');
    const lowTides = data.filter(d => d.type === '低潮');

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
                display: false // 隐藏图例
            }
        },
        scales: {
            y: {
                beginAtZero: false
            }
        }
    };

    return (
        <div style={{ margin: '32px 0', padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
            {date && <div style={{ fontWeight: 'bold', fontSize: 18 }}>{date}</div>}
            <div style={{ margin: '8px 0', fontSize: 15 }}>
                <span style={{ color: 'red', marginRight: 12 }}>高潮: {highTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}</span>
                <span style={{ color: 'green' }}>低潮: {lowTides.map(d => d.time.slice(11, 16)).join(' | ') || '无'}</span>
            </div>
            <div style={{ height: 260 }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
};

export default TideChart;