// 文章管理接口定义
export interface ArticleRecord {
  ArticleID?: number;
  Title: string;
  Content: string;
  Image: string;
  Author: string;
  PublishTime: string;
  Status: number; // 0: 草稿, 1: 已发布
  Sort: number;
  Description: string;
}

// 查询参数接口
export interface ArticleQueryParams {
  ArticleID: number;
  Title: string;
  Author: string;
  Status: number;
  Offset: number;
  Limit: number;
}

// 修改参数接口
export interface ArticleModifyParams extends ArticleRecord {
  ArticleID: number;
} 