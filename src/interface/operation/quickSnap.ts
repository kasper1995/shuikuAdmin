export interface QuickSnapRecord {
  ID: number;
  UserID: number;
  Title: string;
  Remark: string;
  Dir: string;
  Type: string;
  Latitude: string;
  Status: number;
  Address: string;
  AreaID: number;
  Name: string;
  Phone: string;
  IDCard: string;
  CreateTime: string;
  UpdateTime: string;
}

export interface QuickSnapQueryParams {
  Offset: number;
  Limit: number;
}

export interface QuickSnapModifyParams {
  ID: number;
  Status: number;
}

export interface QuickSnapDeleteParams {
  ID: number;
}

export interface QuickSnapQueryResult {
  Code: number;
  Data: {
    List: QuickSnapRecord[];
    Count: number;
  };
  RequestID: string;
  Status: string;
  Token: string;
} 