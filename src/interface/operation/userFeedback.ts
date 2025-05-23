export interface UserFeedbackRecord {
  ID: number;
  CustomerID: number;
  Question: string;
  Imgs: string[];
  Status: string;
  Reply: string;
  CreateTime: string;
  ReplyTime: string;
  Point: number;
  WaterLabName: string;
}

export interface UserFeedbackQueryParams {
  Question?: string;
  Status?: string;
  Reply?: string;
  WaterID?: number;
  CreateStartTime?: string;
  CreateEndTime?: string;
  ReplyStartTime?: string;
  ReplyEndTime?: string;
  Offset: number;
  Limit: number;
}

export interface UserFeedbackModifyParams {
  QuestionID: number;
  Status: string;
  Reply: string;
}

export interface UserFeedbackQueryResult {
  Code: number;
  Data: {
    List: UserFeedbackRecord[];
    Count: number;
  };
  RequestID: string;
  Status: string;
  Token: string;
} 