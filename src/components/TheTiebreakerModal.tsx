import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Scale, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Dices, 
  BrainCircuit, 
  Hourglass, 
  ShieldAlert, 
  Compass, 
  Loader2,
  CalendarCheck
} from 'lucide-react';
import { DecisionAnalysis, TiebreakerResult } from '../types/decision';
import { Language, translations } from '../utils/i18n';
import { calculateOptionScores } from '../utils/calculations';

interface TheTiebreakerModalProps {
  decision: DecisionAnalysis;
  language: Language;
  onClose: () => void;
}

export const TheTiebreakerModal: React.FC<TheTiebreakerModalProps> = ({
  decision,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [mode, setMode] = useState<
    'rational' | 'devils_advocate' | 'regret_minimization' | 'coin_toss_psychology'
  >('rational');
  const [userPriorityNote, setUserPriorityNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TiebreakerResult | null>(null);
  const [coinFlipping, setCoinFlipping] = useState(false);
  const [coinResultSide, setCoinResultSide] = useState<string | null>(null);

  // Trigger Confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
      });
    } catch {
      // safe fallback
    }
  };

  const handleRunTiebreaker = async () => {
    setIsLoading(true);

    if (mode === 'coin_toss_psychology') {
      setCoinFlipping(true);
      setTimeout(() => {
        const randomOpt = decision.options[Math.floor(Math.random() * decision.options.length)];
        setCoinResultSide(randomOpt.name);
        setCoinFlipping(false);
      }, 1200);
    }

    try {
      // Calculate current user weights to feed server
      const weightsSummary = decision.options.map((opt) => ({
        optionId: opt.id,
        name: opt.name,
        scores: calculateOptionScores(
          opt,
          decision.comparisonMatrix.criteria,
          decision.comparisonMatrix.scores
        ),
      }));

      const res = await fetch('/api/tiebreaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: decision.dilemma,
          options: decision.options.map((o) => ({ id: o.id, name: o.name, tagline: o.tagline })),
          currentWeights: weightsSummary,
          mode,
          userPriorityNote,
          language,
        }),
      });

      if (!res.ok) throw new Error('Failed to run tiebreaker');
      const data: TiebreakerResult = await res.json();
      setResult(data);
      triggerCelebration();
    } catch (err) {
      console.error(err);
      // Fallback verdict if network error
      const highestOpt = decision.options.reduce((prev, curr) => {
        const pScore = calculateOptionScores(
          prev,
          decision.comparisonMatrix.criteria,
          decision.comparisonMatrix.scores
        ).compositeScore;
        const cScore = calculateOptionScores(
          curr,
          decision.comparisonMatrix.criteria,
          decision.comparisonMatrix.scores
        ).compositeScore;
        return cScore > pScore ? curr : prev;
      });

      setResult({
        chosenOptionId: highestOpt.id,
        punchline: language === 'vi' ? `Lựa chọn tối ưu: ${highestOpt.name}` : `Optimal Choice: ${highestOpt.name}`,
        deepDiveVerdict: decision.verdict.rationale,
        blindSpotsToWatch: decision.verdict.keyConditions,
        thirtyDayNextStep: language === 'vi' ? 'Lập kế hoạch hành động chi tiết và thực thi ngay bước đầu tiên.' : 'Execute your immediate 24-hour sprint.',
        the101010Test: {
          tenMinutes: language === 'vi' ? 'Cảm thấy nhẹ nhõm vì đã dứt khoát đưa ra quyết định.' : 'Relief from ending mental paralysis.',
          tenMonths: language === 'vi' ? 'Thấy rõ đà tăng trưởng và dữ liệu thực tế.' : 'Tangible progress and validated outcomes.',
          tenYears: language === 'vi' ? 'Tự hào vì đã dám hành động thay vì đứng im.' : 'Gratitude for taking strategic action.',
        },
      });
      triggerCelebration();
    } finally {
      setIsLoading(false);
    }
  };

  const winningOption = decision.options.find((o) => o.id === result?.chosenOptionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative my-auto">
        {/* Glowing aura header */}
        <div className="p-6 bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Scale className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>{t.tiebreakerBtn}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  AI Adjudicator
                </span>
              </h3>
              <p className="text-xs text-slate-400">{t.tiebreakerSubtitle}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          {!result && (
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                {language === 'vi' ? 'Chọn Phương thức Phân xử:' : 'Select Adjudication Lens:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('rational')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    mode === 'rational'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-1">
                    <BrainCircuit className="w-4 h-4 text-amber-400" />
                    <span>{t.modalRational}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'vi'
                      ? 'Thuật toán tổng hợp dựa trên trọng số bạn vừa tinh chỉnh.'
                      : 'Multi-attribute mathematical balance of your custom weights.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('devils_advocate')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    mode === 'devils_advocate'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                    <span>{t.modalDevilsAdvocate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'vi'
                      ? 'Phản biện gay gắt các thiên kiến và rủi ro tiềm ẩn mà bạn bỏ qua.'
                      : 'Challenges the safe path and tests worst-case blind spots.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('regret_minimization')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    mode === 'regret_minimization'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-1">
                    <Hourglass className="w-4 h-4 text-sky-400" />
                    <span>{t.modalRegret}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {language === 'vi'
                      ? 'Khung tư duy 10/10/10: 10 phút, 10 tháng và 10 năm sau nhìn lại.'
                      : 'Jeff Bezos framework: Look back from 10 minutes, 10 months, 10 years.'}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('coin_toss_psychology')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    mode === 'coin_toss_psychology'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-200 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 mb-1">
                    <Dices className="w-4 h-4 text-emerald-400" />
                    <span>{t.modalCoinToss}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{t.coinTossDesc}</p>
                </button>
              </div>

              {/* Optional gut note */}
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {language === 'vi'
                    ? 'Bạn đang thiên vị hoặc lo sợ điều gì nhất lúc này? (Tùy chọn)'
                    : 'What is your subconscious leaning or biggest fear right now? (Optional)'}
                </label>
                <input
                  type="text"
                  value={userPriorityNote}
                  onChange={(e) => setUserPriorityNote(e.target.value)}
                  placeholder={
                    language === 'vi'
                      ? 'Ví dụ: Tôi sợ kiệt sức, hoặc tôi muốn tối đa hóa sự nghiệp...'
                      : 'e.g. I fear burnout, or I crave autonomy above all else...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={handleRunTiebreaker}
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-extrabold text-base bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-xl shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{language === 'vi' ? 'Đang thẩm định phán quyết...' : 'Adjudicating verdict...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>{t.runTiebreaker}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* VERDICT RESULTS PRESENTATION */}
          {result && (
            <div className="space-y-6">
              {/* Coin flip feedback if psychology coin toss */}
              {coinResultSide && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Dices className="w-4 h-4" />
                    <span>
                      {language === 'vi' ? 'Kết quả tung đồng xu:' : 'Coin Toss landed on:'}{' '}
                      <span className="text-white underline">{coinResultSide}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-300/80">
                    {language === 'vi'
                      ? 'Nếu bạn cảm thấy nhẹ nhõm, bạn đã có câu trả lời. Nếu bạn thấy thất vọng hoặc muốn tung lại, hãy chọn phương án ngược lại!'
                      : 'If you felt relief, that is your choice. If you felt disappointed or wanted to re-flip, pick the other option!'}
                  </p>
                </div>
              )}

              {/* The Champion Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-950 border-2 border-amber-500/60 shadow-2xl relative overflow-hidden">
                <div className="absolute top-2 right-3 text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 tracking-wider">
                  WINNER
                </div>

                <div className="text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                  The Tiebreaker Verdict
                </div>
                <h4 className="text-2xl font-black text-white">{winningOption?.name || result.chosenOptionId}</h4>
                <p className="text-sm font-semibold text-amber-200/90 mt-1 italic">
                  "{result.punchline}"
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {result.deepDiveVerdict}
                </div>
              </div>

              {/* 10/10/10 Framework Card */}
              {result.the101010Test && (
                <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                    <Hourglass className="w-4 h-4" />
                    <span>{t.the101010Title}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      <div className="font-bold text-slate-400 mb-1">{t.in10Mins}</div>
                      <p className="text-slate-200 leading-relaxed">{result.the101010Test.tenMinutes}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      <div className="font-bold text-slate-400 mb-1">{t.in10Months}</div>
                      <p className="text-slate-200 leading-relaxed">{result.the101010Test.tenMonths}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800/80">
                      <div className="font-bold text-slate-400 mb-1">{t.in10Years}</div>
                      <p className="text-slate-200 leading-relaxed">{result.the101010Test.tenYears}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Blind spots to watch */}
              {result.blindSpotsToWatch && result.blindSpotsToWatch.length > 0 && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-300">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t.blindSpots}</span>
                  </div>
                  <ul className="text-xs text-rose-200/90 space-y-1 list-disc list-inside">
                    {result.blindSpotsToWatch.map((spot, i) => (
                      <li key={i}>{spot}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 30-day next step */}
              {result.thirtyDayNextStep && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <CalendarCheck className="w-4 h-4" />
                    <span>{t.thirtyDayAction}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {result.thirtyDayNextStep}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setCoinResultSide(null);
                  }}
                  className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer"
                >
                  ← {language === 'vi' ? 'Thử lăng kính phân xử khác' : 'Try another lens'}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  {t.close}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
