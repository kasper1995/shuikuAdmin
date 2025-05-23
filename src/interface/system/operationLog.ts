export interface OperationLog {
  ID: number;
  Username: string;
  Nickname: string;
  GroupName: string;
  Operation: string;
  IP: string;
  CreateTime: string;
}

export interface OperationLogQueryParams {
  Username?: string;
  Index?: number;
  PageCount?: number;
}

export interface OperationLogQueryResult {
  List: OperationLog[];
  Count: number;
} 