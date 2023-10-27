enum Budget {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

export interface TiktokAdModel {
  id: string;
  adId: string;
  likes: number;
  ctr: number; // in percent
  budgetEnum: Budget;

  title: string;
  brandName: string;
  industryKey: string;
  industryGroupCode: string;
  language: string;
  objectiveKey: string;
  videoInfo: {
    id: string;
    cover: string;
    urls: Record<string, string>;
    width: number;
    height: number;
    duration: number;
  };

  comments: number;
  shares: number;
  landingPageUrl: string;

  views: number;
  budget: number;
  videoUploaded?: boolean;
  createdAt: number;
  updatedAt: number;
}
