export interface DecisionItem {
  id: string;
  text: string;
  explanation: string;
  weight: number; // 1 to 10
  category?: string;
}

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionModel {
  id: string;
  name: string;
  tagline: string;
  description: string;
  pros: DecisionItem[];
  cons: DecisionItem[];
  swot: SWOTAnalysis;
}

export interface Criterion {
  id: string;
  name: string;
  description: string;
  weight: number; // 1 to 10
}

export interface CriterionScore {
  criteriaId: string;
  scoresByOption: {
    optionId: string;
    score: number; // 1 to 10
  }[];
  commentary: string;
}

export interface TOWSTactic {
  type: 'SO' | 'WO' | 'ST' | 'WT';
  title: string;
  action: string;
  relevantOption?: string;
}

export interface Verdict {
  recommendedOptionId: string;
  headline: string;
  rationale: string;
  confidenceScore: number;
  keyConditions: string[];
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  dilemma: string;
  contextNotes?: string;
  summary: string;
  options: OptionModel[];
  comparisonMatrix: {
    criteria: Criterion[];
    scores: CriterionScore[];
  };
  towsTactics: TOWSTactic[];
  verdict: Verdict;
  language: 'vi' | 'en';
}

export interface TiebreakerResult {
  chosenOptionId: string;
  punchline: string;
  deepDiveVerdict: string;
  blindSpotsToWatch: string[];
  thirtyDayNextStep: string;
  the101010Test: {
    tenMinutes: string;
    tenMonths: string;
    tenYears: string;
  };
}

export type ViewTab = 'list' | 'grid' | 'strategy' | 'tiebreaker';
