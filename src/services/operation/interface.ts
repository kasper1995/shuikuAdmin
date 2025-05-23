// 航拍全景图接口
export interface ISailView {
  ID: number;
  Title: string;
  Image: string;
  WaterID: number;
  WaterName?: string; // 水库名称
  CreateTime: string;
  UpdateTime: string;
}

export interface ISailViewQueryParams {
  Title?: string;
  WaterID?: number;
  Offset: number;
  Limit: number;
}

export interface ISailViewResponse {
  Total: number;
  Items: ISailView[];
}

// 通用响应接口
export interface IResponse<T = any> {
  Code: number;
  Message: string;
  Data: T;
}
