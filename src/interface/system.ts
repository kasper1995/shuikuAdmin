export interface SystemGroupRecord {
  ID: number;
  GroupName: string;
  Status: 'active' | 'banned';
  CreatedAt: string;
  UpdatedAt: string;
}
export interface SystemUserRecord {
  ID: number;
  Nick: string;
  Username: string;
  GroupName: string;
  Status: 'active' | 'banned';
  CreatedAt: string;
  UpdatedAt: string;
}
export interface SystemApiRecord {
  ID: number;
  Module: string;
  Action: string;
  ActionCname: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SystemApiMapState {
  apiMap: SystemApiMapRecord[];
  loading: boolean;
}

export interface SystemApiMapRecord {
  GroupName: string;
  List: string[];
}