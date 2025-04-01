export interface PatrolQuestion {
  ID: number;
  Title: string;
  TitleImg: string;
  Type: number;
  Options: string;
  OptionType: number;
  Answer: string;
  Point: number;
  CreateTime: string;
  Relevancy: string;
  Sort: number;
  CateID: number;
}

// 查询参数接口
export interface QuestionQueryParams {
  CateID?: number;
  Title?: string;
  Type?: number;
  Offset: number;
  Limit: number;
}

// 修改参数接口
export interface QuestionModifyParams extends Omit<PatrolQuestion, 'ID' | 'CreateTime'> {
  ID?: number;
} 