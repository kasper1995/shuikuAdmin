export interface LimitLogOption {
  option_name: string;
  is_mobile: number;
  is_require: number;
  value: string | number;
}

export interface LimitLog {
  ID: number;
  UID: number;
  ActiveLimitID: number;
  OptionsSelect: string;
  CreateTime: string;
}

export interface LimitActivity {
  ID: number;
  Title: string;
  Options: string;
}

export interface LimitLogQueryParams {
  ActiveLimitID: number;
  StartTime?: string;
  EndTime?: string;
  Index: number;
  PageCount: number;
}

export interface LimitLogQueryResult {
  Code: number;
  Data: {
    List: LimitLog[];
    Count: number;
  };
  Message?: string;
} 