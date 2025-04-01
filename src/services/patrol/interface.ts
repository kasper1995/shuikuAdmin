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
  WaterID?: number;
  Title?: string;
  PageIndex: number;
  PageSize: number;
}

export interface ISailViewResponse {
  Total: number;
  Items: ISailView[];
} 