export interface TideData {
    time: string;
    height: number;
    type: string;
}

export interface TideDay {
    date: string;
    type: string; // 汛型
    data: TideData[];
}

export interface TideResponse {
    tides: TideData[];
}