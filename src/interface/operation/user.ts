export interface OperationUser {
  ID: number;
  City: string;
  Address: string;
  Avatar: string;
  Nickname: string;
  StyleID: number;
  Point: number;
  CreatedTime: string;
  UpdatedTime: string;
}

export interface OperationUserQueryParams {
  City?: string;
  Address?: string;
  Nickname?: string;
  StyleID?: number;
  StartTime?: string;
  EndTime?: string;
  Offset: number;
  Limit: number;
}

export interface OperationUserQueryResult {
  Code: number;
  Message: string;
  Data: {
    List: OperationUser[];
    Count: number;
  };
} 