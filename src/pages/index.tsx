import React, { useEffect, useState } from 'react';
import TideChart from '../components/TideChart';
import { fetchTideData } from '../utils/fetchTideData';
import { TideDay } from '../types/tide';
import { Lunar } from 'lunar-javascript';

const camNames = ['石老人', '栈桥', '小麦岛'];
const camImgUrls = [
  '/images/shilaoren.jpg',
  '/images/zhanqiao.jpg',
  '/images/xiaomaidao.jpg'
];

function getTideType(dateStr: string) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const lunar = Lunar.fromYmd(y, m, d);
    const day = lunar.getDay();
    if ([1,2,14,15,16,17,29,30].includes(day)) return '活汛';
    if ([8,9,22,23].includes(day)) return '死汛';
    return '中汛';
}

const IndexPage: React.FC = () => {
    const [tideDays, setTideDays] = useState<TideDay[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTideData = async () => {
            try {
                const data = await fetchTideData();
                setTideDays(data);
            } catch (err) {
                setError('Failed to fetch tidal data');
            } finally {
                setLoading(false);
            }
        };

        getTideData();
    }, []);

    if (loading) {
        return <div>Loading tidal data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <div style={{display:'flex',justifyContent:'flex-end',alignItems:'center',fontWeight:'bold',fontSize:16,marginBottom:8}}>
                Tide Height (m)
            </div>
            <h1>青岛未来三天潮汐数据 / 3-Day Tidal Data for Qingdao, China</h1>
            {tideDays.map((day, idx) => {
                const tideType = getTideType(day.date);
                let color = '#222';
                if (tideType === '活汛') color = 'red';
                else if (tideType === '死汛') color = '#007b7b';
                else if (tideType === '中汛') color = '#888800';
                return (
                    <div key={day.date}>
                        {/* 传递汛型到 TideChart，显示在日期右侧 */}
                        <TideChart
                            data={day.data}
                            date={day.date}
                        >
                            <span style={{marginLeft:12,color,fontSize:16,fontWeight:'bold'}}>{tideType}</span>
                        </TideChart>
                    </div>
                );
            })}
            {/* 三个实时图像分区，地点为石老人、栈桥、小麦岛 */}
            <div style={{ height: 24 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                {camImgUrls.map((url, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center', margin: '0 8px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{camNames[idx]}</div>
                        <div style={{ background: '#eee', height: 180, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            <img
                                src={url}
                                alt={camNames[idx] + '实时图像'}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', borderRadius: 8 }}
                                draggable={false}
                            />
                        </div>
                    </div>
                ))}
            </div>
            {/* copyright 信息 */}
            <div style={{ marginTop: 40, width: '100%', textAlign: 'center', color: '#888', fontSize: 14, paddingBottom: 24 }}>
                Copyright © {new Date().getFullYear()}
            </div>
        </div>
    );
};

export default IndexPage;