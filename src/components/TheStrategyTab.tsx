import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Compass, 
  Zap, 
  Flame, 
  Crosshair, 
  Layers 
} from 'lucide-react';
import { DecisionAnalysis, TOWSTactic } from '../types/decision';
import { Language, translations } from '../utils/i18n';

interface TheStrategyTabProps {
  decision: DecisionAnalysis;
  language: Language;
}

export const TheStrategyTab: React.FC<TheStrategyTabProps> = ({
  decision,
  language,
}) => {
  const t = translations[language];
  const [activeOptionId, setActiveOptionId] = useState<string>(decision.options[0]?.id || '');

  const activeOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];

  const towsBadgeColors: Record<string, string> = {
    SO: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    WO: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    ST: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    WT: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  };

  const towsBadgeLabels: Record<string, string> = {
    SO: language === 'vi' ? 'Maxi-Maxi (Tận dụng Mạnh để chớp Cơ hội)' : 'Maxi-Maxi (Strength-Opportunity)',
    WO: language === 'vi' ? 'Mini-Maxi (Khắc phục Yếu để đón Cơ hội)' : 'Mini-Maxi (Weakness-Opportunity)',
    ST: language === 'vi' ? 'Maxi-Mini (Dùng Mạnh phòng thủ Thách thức)' : 'Maxi-Mini (Strength-Threat)',
    WT: language === 'vi' ? 'Mini-Mini (Thu hẹp Yếu & Tránh Thách thức)' : 'Mini-Mini (Weakness-Threat)',
  };

  return (
    <div className="space-y-8">
      {/* Option Filter Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {decision.options.map((opt, idx) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveOptionId(opt.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                opt.id === activeOption?.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt.name}</span>
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-400 font-medium px-2">
          {language === 'vi' ? 'Mô hình SWOT Chiến lược 4 Góc' : '4-Quadrant Strategic SWOT Model'}
        </div>
      </div>

      {/* 4-QUADRANT SWOT MATRIX */}
      {activeOption && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* STRENGTHS (Internal Positive) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-emerald-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-500/20">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                  {t.strengths}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {language === 'vi' ? 'Yếu tố nội tại vượt trội' : 'Internal Advantages'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activeOption.swot.strengths.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WEAKNESSES (Internal Negative) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-rose-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-rose-500/20">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wider">
                  {t.weaknesses}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {language === 'vi' ? 'Hạn chế & chi phí nội tại' : 'Internal Constraints & Costs'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activeOption.swot.weaknesses.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* OPPORTUNITIES (External Positive) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-sky-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-sky-500/20">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sky-300 uppercase tracking-wider">
                  {t.opportunities}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {language === 'vi' ? 'Thời cơ & Đòn bẩy bên ngoài' : 'External Upside & Leverage'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activeOption.swot.opportunities.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* THREATS (External Negative) */}
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-amber-500/30 shadow-lg space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-amber-500/20">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  {t.threats}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {language === 'vi' ? 'Rủi ro môi trường & Đối thủ' : 'External Hazards & Competitors'}
                </span>
              </div>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {activeOption.swot.threats.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TOWS MATRIX SECTION */}
      {decision.towsTactics && decision.towsTactics.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Crosshair className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">{t.towsTitle}</h3>
              <p className="text-xs text-slate-400">{t.towsSubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {decision.towsTactics.map((tactic, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                      towsBadgeColors[tactic.type] || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tactic.type}: {towsBadgeLabels[tactic.type] || tactic.type}
                  </span>
                  {tactic.relevantOption && (
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                      {tactic.relevantOption}
                    </span>
                  )}
                </div>

                <h4 className="text-xs sm:text-sm font-bold text-slate-100">{tactic.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{tactic.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
