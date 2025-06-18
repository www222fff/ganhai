import React, { useEffect, useState } from 'react';
import TideChart from '../components/TideChart';
import { fetchTideData } from '../utils/fetchTideData';
import { TideDay } from '../types/tide';

const camNames = ['石老人', '栈桥', '小麦岛'];
const camImgUrls = [
  '/images/shilaoren.jpg',
  '/images/zhanqiao.jpg',
  '/images/xiaomaidao.jpg'
];

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
                潮高 Tide Height (m)
            </div>
            <h1>青岛未来三天潮汐数据 / 3-Day Tidal Data for Qingdao, China</h1>
            {tideDays.map((day, idx) => (
                <TideChart key={day.date} data={day.data} date={day.date} />
            ))}
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
        </div>
    );
};

export default IndexPage;