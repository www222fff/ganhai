import React, { useEffect, useState } from 'react';
import TideChart from '../components/TideChart';
import { fetchTideData } from '../utils/fetchTideData';
import { TideData } from '../types/tide';

const camNames = ['石老人', '栈桥', '小麦岛'];
const camImgUrls = [
    // EarthCam 静态图片流或占位图
    'https://images.earthcam.com/ec_metros/ourcams/fridays.jpg', // 替换为石老人真实流时可用
    'https://images.earthcam.com/ec_metros/ourcams/miami.jpg',   // 替换为栈桥真实流时可用
    'https://images.earthcam.com/ec_metros/ourcams/miamibeach.jpg' // 替换为小麦岛真实流时可用
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
            <h1>Tidal Data for Qingdao, China</h1>
            <TideChart data={tideData} />
            {/* 三个实时图像分区，地点为石老人、栈桥、小麦岛 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                {camImgUrls.map((url, idx) => (
                    <div key={idx} style={{ flex: 1, textAlign: 'center', margin: '0 8px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{camNames[idx]}</div>
                        <div style={{ background: '#eee', height: 180, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <img
                                src={url}
                                alt={camNames[idx] + '实时图像'}
                                style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 8 }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IndexPage;