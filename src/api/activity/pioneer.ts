import { request } from '@/api/request';

export interface IPioneerQueryParams {
  ID?: number;
  StudentName?: string;
  StudentCard?: string;
  StudentSch?: string;
  StudentCls?: string;
  GuardianName?: string;
  GuardianPhone?: string;
  GuardianCard?: string;
  StartTime?: string;
  EndTime?: string;
  Index?: number;
  PageCount?: number;
}

export interface IPioneer {
  ID: number;
  UserID: number;
  StudentName: string;
  StudentSex: string;
  StudentCard: string;
  StudentSch: string;
  StudentCls: string;
  GuardianName: string;
  GuardianRel: string;
  GuardianPhone: string;
  GuardianCard: string;
  CreateTime: string;
  UpdateTime: string;
}

export interface IPioneerResponse {
  Code: number;
  Message: string;
  Data: IPioneer[];
}

export const queryPioneers = (params: IPioneerQueryParams) => {
  return request<IPioneerResponse>('post', '/query_young_pioneers', params);
};
