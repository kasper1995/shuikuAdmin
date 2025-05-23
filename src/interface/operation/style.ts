export interface Style {
  ID: number;
  Title: string;
  URL: string;
  CreateTime: number;
  Default: boolean;
  StartTime: number;
  EndTime: number;
  OrderBy: number;
  Type: number;
  FontColor: string;
  BackColor: string;
}

export interface StyleQueryResult {
  Code: number;
  Message: string;
  Data: Style[];
} 