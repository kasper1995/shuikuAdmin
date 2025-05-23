export interface SystemDict {
  ID: number;
  Item: string;
  Value: string;
  Desc: string;
}

export interface SystemDictQueryParams {
  Item?: string;
}

export interface SystemDictQueryResult {
  api_module: SystemDict[];
}

export interface CreateSystemDictParams {
  Item: string;
  Value: string;
  Desc: string;
} 