
export interface Campaign {
  id: string;
  title: string;
  thumbnailA: string;
  thumbnailB: string;
  totalVotes: number;
  insightCount: number;
  goalCount: number;
  status: 'active' | 'completed';
  createdAt: string;
  isRead?: boolean;
  rewardLight: number;
  rewardDeep: number;
  isHot?: boolean;
  // 셀러 설정 질문 추가
  objectiveQuestion?: string;
  objectiveOptions?: string[];
  subjectiveQuestion?: string;
}

export type AppRole = 'seller' | 'user';
export type AppView = 'dashboard' | 'create' | 'reports' | 'profile' | 'feed' | 'wallet' | 'reel';
