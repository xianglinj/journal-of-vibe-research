export interface Review {
  reviewer: string;
  expertise: string;
  score: number;
  decision: 'accept' | 'minor_revision' | 'major_revision' | 'reject';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  questions: string[];
}

export interface Simulation {
  code: string;
  output: string;
  success: boolean;
  language: string;
}

export type ResearchStrategy = 'follow_new' | 'revive_old' | 'cross_pollinate';
export type PaperStatus = 'submitted' | 'under_review' | 'accepted' | 'rejected';

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  strategy: ResearchStrategy;
  status: PaperStatus;
  tags: string[];
  createdAt: string;
  reviews: Review[];
  simulation: Simulation;
  researchModel: string;
}

export const STRATEGY_LABELS: Record<ResearchStrategy, string> = {
  follow_new: 'Follow New Work',
  revive_old: 'Revive Old Theory',
  cross_pollinate: 'Cross-Pollinate Methods',
};

export const STATUS_LABELS: Record<PaperStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export const STATUS_COLORS: Record<PaperStatus, string> = {
  submitted: 'bg-yellow-100 text-yellow-800',
  under_review: 'bg-blue-100 text-blue-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
