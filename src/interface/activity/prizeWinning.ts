export interface PrizeWinningRecord {
  ID: number;
  LuckyID: number;
  MemberID: number;
  PrizeID: number;
  PrizeName: string;
  Status: number;
  CreateTime: string;
  UpdateTime: string;
  DeliveryRealname: string;
  DeliveryPhone: string;
  DeliveryAddress: string;
  ExpressNo: string;
  DeliveryStatus: number;
  ExpressCompany: string;
}

export interface PrizeWinningQueryParams {
  MemberID?: number;
  PrizeID?: number;
  StartTime?: string;
  EndTime?: string;
  Index: number;
  PageCount: number;
}

export interface PrizeWinningQueryResult {
  Code: number;
  Data: {
    List: PrizeWinningRecord[];
    Count: number;
  };
  RequestID: string;
  Status: string;
  Token: string;
}

export interface PrizeWinningModifyParams {
  ID: number;
  ExpressNo: string;
  ExpressCompany: string;
  DeliveryStatus: number;
} 