import { request } from '@/api/request';

export interface IPrizeQueryParams {
  ID?: number;
  MemberID?: number;
  GoodsName?: string;
  Mobile?: string;
  AddressRealname?: string;
  AddressPhone?: string;
  AddressAddress?: string;
  AddressExpressNo?: string;
  AddressExpressCompany?: string;
  AddressStatus?: number;
  StartTime?: string;
  EndTime?: string;
  Index?: number;
  PageCount?: number;
}

export interface IPrize {
  ID: number;
  MemberID: number;
  GoodsID: number;
  Mobile: string;
  Point: number;
  Status: number;
  CreateTime: string;
  UpdateTime: string;
  AddressMethod: number;
  AddressRealname: string;
  AddressPhone: string;
  AddressAddress: string;
  AddressRawinfo: string;
  AddressExpressNo: string;
  AddressStatus: number;
  AddressExpressCompany: string;
  Name: string;
}

export interface IPrizeResponse {
  Code: number;
  Message: string;
  Data: IPrize[];
}

export interface IPrizeModifyParams {
  ID: number;
  AddressExpressNo: string;
  AddressExpressCompany: string;
  AddressStatus: number;
}

export const queryPrizes = (params: IPrizeQueryParams) => {
  return request<IPrizeResponse>('post', '/query_prize', params);
};

export const modifyPrize = (params: IPrizeModifyParams) => {
  return request<{ Code: number; Message: string }>('post', '/modify_prize', params);
};
