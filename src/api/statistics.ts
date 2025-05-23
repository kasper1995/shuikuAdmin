import { request } from '@/api/request';

interface QueryStatisticsParams {
  StartDate: string;
  EndDate: string;
}

interface StatisticsData {
  User: {
    Time: string;
    Register: number;
    Active: number;
    Visitor: number;
  }[];
  Point: {
    Time: string;
    Add: number;
    Subtract: number;
  }[];
}

export const queryStatistics = (params: QueryStatisticsParams) => {
  return request<StatisticsData>('post', '/data_stat', params);
};
