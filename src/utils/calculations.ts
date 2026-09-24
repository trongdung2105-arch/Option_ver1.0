import { OptionModel, Criterion, CriterionScore } from '../types/decision';

export interface OptionCalculatedScores {
  proSum: number;
  conSum: number;
  netScore: number;
  matrixScore: number; // 0 - 100
  compositeScore: number; // 0 - 100
}

export function calculateOptionScores(
  option: OptionModel,
  criteria: Criterion[],
  criterionScores: CriterionScore[]
): OptionCalculatedScores {
  const proSum = option.pros.reduce((acc, p) => acc + (p.weight || 5), 0);
  const conSum = option.cons.reduce((acc, c) => acc + (c.weight || 5), 0);
  const netScore = proSum - conSum;

  let totalWeightedScore = 0;
  let maxPossibleWeightedScore = 0;

  criteria.forEach((crit) => {
    const critWeight = crit.weight || 5;
    const scoreItem = criterionScores.find((s) => s.criteriaId === crit.id);
    const optScore = scoreItem?.scoresByOption.find((o) => o.optionId === option.id)?.score || 5;

    totalWeightedScore += optScore * critWeight;
    maxPossibleWeightedScore += 10 * critWeight;
  });

  const matrixScore = maxPossibleWeightedScore > 0
    ? Math.round((totalWeightedScore / maxPossibleWeightedScore) * 100)
    : 50;

  // Composite: 50% list net normalized + 50% matrix score
  // Normalize netScore where 0 is 50%, +30 is 100%, -30 is 0%
  const normalizedListScore = Math.min(100, Math.max(0, Math.round(50 + (netScore * 1.5))));
  const compositeScore = Math.round((normalizedListScore * 0.4) + (matrixScore * 0.6));

  return {
    proSum,
    conSum,
    netScore,
    matrixScore,
    compositeScore,
  };
}
