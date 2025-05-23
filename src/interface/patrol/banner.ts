export interface PatrolBanner {
  ID: number;
  Title: string;
  Image: string;
  Status: number;
  Sort: number;
  Href: string;
}

export interface PatrolBannerQueryResult {
  Code: number;
  Message: string;
  Data: PatrolBanner[];
}

export interface CreatePatrolBannerParams {
  Title: string;
  Image: string;
  Status: number;
  Sort: number;
  Href: string;
} 