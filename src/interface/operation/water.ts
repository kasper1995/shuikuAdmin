// 水库管理接口定义
export interface WaterLabRecord {
    WaterLabID?: number;
    Name: string;
    LatLng: string;
    Polygons: number;
    Level: string;
    Cover: string;
    Icon: string;
    HIcon: string;
    Code: string;
    Sort: number;
    Description: string;
    VRUrl: string;
  }

  // 查询参数接口
  export interface WaterLabQueryParams {
    WaterLabID?: number;
    Name?: string;
    Level?: string;
    Code?: string;
    Description?: string;
    Offset?: number;
    Limit?: number;
  }

  // 修改参数接口
  export interface WaterLabModifyParams extends WaterLabRecord {
    WaterLabID: number;
  }
