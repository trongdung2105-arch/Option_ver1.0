import React, { useState } from 'react';
import { 
  Table, 
  Layers, 
  Sliders, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';
import { DecisionAnalysis, Criterion } from '../types/decision';
import { Language, translations } from '../utils/i18n';
import { calculateOptionScores } from '../utils/calculations';

interface TheGridTabProps {
  decision: DecisionAnalysis;
  language: Language;
  onUpdateCriterionWeight: (criteriaId: string, newWeight: number) => void;
}

export const TheGridTab: React.FC<TheGridTabProps> = ({
  decision,
  language,
  onUpdateCriterionWeight,
}) => {
  const t = translations[language];
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [activeCriterionIndex, setActiveCriterionIndex] = useState(0);

  const criteria = decision.comparisonMatrix.criteria;
  const scores = decision.comparisonMatrix.scores;

  const currentCriterion = criteria[activeCriterionIndex] || criteria[0];
  const currentCriterionScore = scores.find((s) => s.criteriaId === currentCriterion?.id);

  // Helper for score badge colors
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    if (score >= 6) return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: View Toggle & Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{t.comparisonCriteria} ({criteria.length})</span>
          </h3>
          <p className="text-xs text-slate-400">
            {language === 'vi'
              ? 'So sánh trực quan các lựa chọn trên từng khía cạnh then chốt'
              : 'Direct side-by-side multi-attribute matrix scoring'}
          </p>
        </div>

        {/* View Mode Toggle: Table vs Cards */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{t.tableView}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t.swipeCardView}</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MATRIX TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto rounded-2xl border border-slate-800/90 shadow-xl bg-slate-900/50">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-300">
                <th className="p-4 min-w-[200px] sm:min-w-[260px]">
                  {language === 'vi' ? 'Tiêu chí & Trọng số' : 'Criterion & Weight'}
                </th>
                {decision.options.map((option, idx) => {
                  const sc = calculateOptionScores(
                    option,
                    decision.comparisonMatrix.criteria,
                    decision.comparisonMatrix.scores
                  );

                  return (
                    <th key={option.id} className="p-4 min-w-[180px] border-l border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-white text-sm font-extrabold">{option.name}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-amber-400 font-mono font-normal">
                        Score: {sc.matrixScore}%
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {criteria.map((crit) => {
                const critScore = scores.find((s) => s.criteriaId === crit.id);

                return (
                  <tr key={crit.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Criteria Info & Weight Slider */}
                    <td className="p-4 align-top">
                      <div className="font-bold text-slate-100 text-sm">{crit.name}</div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{crit.description}</p>

                      {/* Criterion Weight Slider */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[11px] text-slate-500 font-medium">{t.criteriaWeight}</span>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={crit.weight}
                          onChange={(e) => onUpdateCriterionWeight(crit.id, Number(e.target.value))}
                          className="w-24 accent-amber-500 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-xs text-amber-400">{crit.weight}</span>
                      </div>
                    </td>

                    {/* Options Scores */}
                    {decision.options.map((option) => {
                      const optScore = critScore?.scoresByOption.find((o) => o.optionId === option.id)?.score || 5;

                      return (
                        <td key={option.id} className="p-4 align-top border-l border-slate-800/80">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-sm border ${getScoreColor(
                                optScore
                              )}`}
                            >
                              {optScore}/10
                            </span>
                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  optScore >= 8 ? 'bg-emerald-500' : optScore >= 6 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${optScore * 10}%` }}
                              />
                            </div>
                          </div>
                          {critScore?.commentary && (
                            <p className="text-[11px] text-slate-400 leading-relaxed italic">
                              {critScore.commentary}
                            </p>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODE 2: SWIPEABLE CARDS VIEW (Mobile optimized) */}
      {viewMode === 'cards' && currentCriterion && (
        <div className="space-y-4">
          {/* Card Carousel Navigation */}
          <div className="flex items-center justify-between px-2">
            <button
              type="button"
              disabled={activeCriterionIndex === 0}
              onClick={() => setActiveCriterionIndex((prev) => Math.max(0, prev - 1))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {activeCriterionIndex + 1} / {criteria.length}
            </span>
            <button
              type="button"
              disabled={activeCriterionIndex === criteria.length - 1}
              onClick={() => setActiveCriterionIndex((prev) => Math.min(criteria.length - 1, prev + 1))}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Current Criterion Spotlight */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {language === 'vi' ? 'Tiêu chí' : 'Criterion'} #{activeCriterionIndex + 1}
                </span>
                <h4 className="text-lg font-bold text-white mt-1">{currentCriterion.name}</h4>
                <p className="text-xs text-slate-400">{currentCriterion.description}</p>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400">{t.criteriaWeight}:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentCriterion.weight}
                  onChange={(e) => onUpdateCriterionWeight(currentCriterion.id, Number(e.target.value))}
                  className="w-20 accent-amber-500"
                />
                <span className="font-mono font-bold text-xs text-amber-400">{currentCriterion.weight}</span>
              </div>
            </div>

            {/* Options Side by Side comparison for this criterion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {decision.options.map((option, idx) => {
                const optScore =
                  currentCriterionScore?.scoresByOption.find((o) => o.optionId === option.id)?.score || 5;

                return (
                  <div
                    key={option.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {String.fromCharCode(65 + idx)}. {option.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${getScoreColor(
                          optScore
                        )}`}
                      >
                        {optScore}/10
                      </span>
                    </div>

                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          optScore >= 8 ? 'bg-emerald-500' : optScore >= 6 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${optScore * 10}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {currentCriterionScore?.commentary && (
              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 italic">
                {currentCriterionScore.commentary}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
