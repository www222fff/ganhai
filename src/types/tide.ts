export interface TideData {
    time: string;
    height: number;
    type: string;
}

export interface TideResponse {
    tides: TideData[];
}