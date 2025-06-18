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

// 计算潮汐类型（大活汛、小死汛等）
function getTideType(dayHeights: number[]): string {
    // 排除无效/极端值
    const validHeights = dayHeights.filter(h => typeof h === 'number' && isFinite(h));
    if (validHeights.length < 2) return '未知';
    // 只取当天高潮和低潮的最大/最小值
    const max = Math.max(...validHeights);
    const min = Math.min(...validHeights);
    const diff = +(max - min).toFixed(2); // 保留两位小数
    // 调整阈值：>1.2为大活汛，0.8-1.2为中汛，<0.8为小死汛
    if (diff > 1.2) return `大活汛 (潮差${diff}m)`;
    if (diff > 0.8) return `中汛 (潮差${diff}m)`;
    return `小死汛 (潮差${diff}m)`;
}

export interface TideDay {
    date: string;
    type: string; // 汛型
    data: TideData[];
}

export const fetchTideData = async (): Promise<TideDay[]> => {
    try {
        const response = await getTideData();
        console.log('Open-Meteo API response:', response); // 调试输出
        if (!response || !response.hourly || !response.hourly.time || !response.hourly.sea_level_height_msl) {
            throw new Error('No tidal data found');
        }
        const times = response.hourly.time;
        const heights = response.hourly.sea_level_height_msl;
        // 按天分组
        const daysMap: { [date: string]: { time: string; height: number }[] } = {};
        times.forEach((time: string, idx: number) => {
            const date = time.slice(0, 10);
            if (!daysMap[date]) daysMap[date] = [];
            daysMap[date].push({ time, height: heights[idx] });
        });
        // 只取前3天
        const dayKeys = Object.keys(daysMap).slice(0, 3);
        const result: TideDay[] = dayKeys.map(date => {
            const dayArr = daysMap[date];
            const dayHeights = dayArr.map(d => d.height);
            const extrema = findExtrema(dayHeights);
            const type = getTideType(dayHeights);
            return {
                date,
                type,
                data: dayArr.map((d, idx) => ({
                    time: d.time,
                    height: d.height,
                    type: extrema.high.includes(idx) ? '高潮' : extrema.low.includes(idx) ? '低潮' : '',
                }))
            };
        });
        return result;
    } catch (error) {
        console.error('Error fetching tidal data:', error);
        throw error;
    }
};