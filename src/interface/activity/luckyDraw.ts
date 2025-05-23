export interface LuckyDrawRecord {
  ID: number;
  MemberID: number;
  AnswerScore: number;
  PrizeID: number;
  PrizeName: string;
  CreateTime: string;
}

export interface LuckyDrawQueryParams {
  ID?: number;
  StartTime?: string;
  EndTime?: string;
  Index: number;
  PageCount: number;
}

export interface LuckyDrawQueryResult {
  Code: number;
  Data: {
    List: LuckyDrawRecord[];
    Count: number;
  };
  RequestID: string;
  Status: string;
  Token: string;
} 