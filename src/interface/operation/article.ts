// 文章管理接口定义
export interface ArticleRecord {
  ID: number;
  Title: string;
  Subtitle: string;
  Image: string;
  Imgs: string[];
  Videos: string[];
  Content: string;
  Cate: string;
  Intro: string;
  Author: string;
  Sort: number;
  Clickinfo: number;
  Audio: string;
  CreatedTime: string;
  UpdatedTime: string;
}

// 查询参数接口
export interface ArticleQueryParams {
  CreatedTime: any[];
  StartTime: any;
  EndTime: any;
  Title?: string;
  Cate?: string;
  Offset: number;
  Limit: number;
}

// 修改参数接口
export interface ArticleModifyParams extends Omit<ArticleRecord, 'ID' | 'CreatedTime' | 'UpdatedTime'> {
  ID?: number;
}
