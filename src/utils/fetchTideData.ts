import { getTideData } from '../api/openMeteo';
import { TideData } from '../types/tide';

// 极值检测算法，返回高潮和低潮的索引
function findExtrema(data: number[]): { high: number[]; low: number[] } {
    const high: number[] = [];
    const low: number[] = [];
    for (let i = 1; i < data.length - 1; i++) {
        if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
            high.push(i);
        }
        if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
            low.push(i);
        }
    }
    return { high, low };
}

export const fetchTideData = async (): Promise<TideData[]> => {
    try {
        const response = await getTideData();
        console.log('Open-Meteo API response:', response); // 调试输出
        if (!response || !response.hourly || !response.hourly.time || !response.hourly.sea_level_height_msl) {
            throw new Error('No tidal data found');
        }
        const times = response.hourly.time;
        const heights = response.hourly.sea_level_height_msl;
        // 检测高潮和低潮
        const extrema = findExtrema(heights);
        // 标记类型
        return times.map((time: string, idx: number) => ({
            time,
            height: heights[idx],
            type: extrema.high.includes(idx) ? '高潮' : extrema.low.includes(idx) ? '低潮' : '',
        }));
    } catch (error) {
        console.error('Error fetching tidal data:', error);
        throw error;
    }
};