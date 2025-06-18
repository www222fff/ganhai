import React, { useEffect, useState } from 'react';
import TideChart from '../components/TideChart';
import { fetchTideData } from '../utils/fetchTideData';
import { TideData } from '../types/tide';

const camNames = ['石老人', '栈桥', '小麦岛'];
const camImgUrls = [
  '/images/shilaoren.jpg',
  '/images/zhanqiao.jpg',
  '/images/xiaomaidao.jpg'
];

const IndexPage: React.FC = () => {
    const [tideData, setTideData] = useState<TideData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getTideData = async () => {
            try {
                const data = await fetchTideData();
                setTideData(data);
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
            <h1>青岛今日潮汐数据 / Tidal Data for Qingdao, China</h1>
            {/* 潮汐极值信息放在潮汐图上方并居中 */}
            {tideData.length > 0 && (
                <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', margin: '24px 0 8px 0' }}>
                    <div>{tideData[0].time.slice(0, 10)}</div>
                    <div style={{ marginTop: 4 }}>
                        {tideData.filter(d => d.type).map((d, idx) => (
                            <span key={idx} style={{ color: d.type === '高潮' ? 'red' : 'green', margin: '0 16px' }}>
                                {d.type} {d.time.slice(11, 16)}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            <TideChart data={tideData} />
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