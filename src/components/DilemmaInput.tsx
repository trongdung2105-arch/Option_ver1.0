import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  ArrowRight, 
  Compass, 
  Loader2,
  FileText
} from 'lucide-react';
import { Language, translations } from '../utils/i18n';
import { PRESET_DECISIONS } from '../data/presets';
import { DecisionAnalysis } from '../types/decision';

interface DilemmaInputProps {
  language: Language;
  onAnalyze: (dilemma: string, options: string[], contextNotes: string) => Promise<void>;
  onSelectPreset: (preset: DecisionAnalysis) => void;
  isLoading: boolean;
}

export const DilemmaInput: React.FC<DilemmaInputProps> = ({
  language,
  onAnalyze,
  onSelectPreset,
  isLoading,
}) => {
  const t = translations[language];
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [contextNotes, setContextNotes] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      const updated = [...options];
      updated[index] = '';
      setOptions(updated);
    }
  };

  const handleOptionChange = (text: string, index: number) => {
    const updated = [...options];
    updated[index] = text;
    setOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim() || isLoading) return;

    const validOptions = options.map((o) => o.trim()).filter((o) => o.length > 0);
    onAnalyze(dilemma.trim(), validOptions, contextNotes.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Hero Welcome banner */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          <span>{language === 'vi' ? 'Đột phá sự bế tắc trong suy nghĩ' : 'Break Decision Paralysis'}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {language === 'vi' ? (
            <>
              Bạn đang gặp khó khăn với <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">quyết định nào?</span>
            </>
          ) : (
            <>
              What critical dilemma is <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">holding you back?</span>
            </>
          )}
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          {language === 'vi'
            ? 'Nhập tình huống của bạn. AI sẽ phân tích đa chiều bằng bảng so sánh, danh sách ưu/nhược có trọng số và ma trận SWOT/TOWS chiến lược.'
            : 'Enter your dilemma. The Tiebreaker constructs structured mental models: weighted pros/cons, side-by-side comparison tables, and rigorous SWOT/TOWS matrices.'}
        </p>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/4 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent" />

        {/* Dilemma Input */}
        <div className="space-y-2 mb-5">
          <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {language === 'vi' ? 'Vấn đề cần quyết định (The "Vibe" Input)' : 'The Dilemma (The "Vibe" Input)'}
            </span>
            <span className="text-[11px] text-slate-500 font-normal">
              {language === 'vi' ? 'Càng cụ thể, phân tích càng sắc bén' : 'Be specific for sharper insights'}
            </span>
          </label>
          <textarea
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder={t.dilemmaPlaceholder}
            rows={3}
            className="w-full px-4 py-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none shadow-inner"
            required
          />
        </div>

        {/* Options Input (Custom or Auto) */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {t.optionsPrompt}
            </label>
            {options.length < 4 && (
              <button
                type="button"
                onClick={handleAddOption}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                {t.addOption}
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {options.map((option, idx) => (
              <div key={idx} className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-amber-500/70 select-none">
                  {String.fromCharCode(65 + idx)}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(e.target.value, idx)}
                  placeholder={
                    language === 'vi' 
                      ? `Lựa chọn ${String.fromCharCode(65 + idx)} (hoặc để AI tự tìm)` 
                      : `Option ${String.fromCharCode(65 + idx)} (or leave for AI)`
                  }
                  className="w-full pl-8 pr-8 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all"
                />
                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="absolute right-2.5 text-slate-500 hover:text-rose-400 p-0.5 rounded cursor-pointer transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 italic">
            {language === 'vi'
              ? '💡 Mẹo: Bạn có thể để trống các lựa chọn, AI sẽ tự động phân tách bài toán thành 2-3 phương án đối trọng sắc bén.'
              : '💡 Tip: You can leave options blank; AI will intelligently infer the most relevant mutually-exclusive choices.'}
          </p>
        </div>

        {/* Expandable Context & Constraints */}
        <div className="border-t border-slate-800/80 pt-4 mb-5">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              {t.contextNotes}
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showAdvanced && (
            <div className="mt-3">
              <textarea
                value={contextNotes}
                onChange={(e) => setContextNotes(e.target.value)}
                placeholder={t.contextPlaceholder}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500/40 transition-all resize-none"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !dilemma.trim()}
          className={`w-full py-3.5 px-6 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg ${
            isLoading || !dilemma.trim()
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/25 active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              <span>{t.analyzing}</span>
            </>
          ) : (
            <>
              <span>{t.analyzeBtn}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </>
          )}
        </button>
      </form>

      {/* Preset Starters */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {t.presetDilemmas}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PRESET_DECISIONS.map((preset) => {
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all cursor-pointer group text-left shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {preset.language === 'vi' ? 'Tiếng Việt' : 'English'}
                  </span>
                  <span className="text-xs text-amber-400/80 group-hover:text-amber-300 flex items-center gap-1 font-semibold">
                    <span>{language === 'vi' ? 'Tải ngay' : 'Load preset'}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-slate-200 line-clamp-2 group-hover:text-white transition-colors">
                  {preset.dilemma}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                  {preset.options.map((o) => o.name).join(' vs ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
