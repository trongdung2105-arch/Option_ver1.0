import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Scale, 
  ListOrdered, 
  Table, 
  ShieldCheck, 
  ArrowLeft, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  RefreshCw,
  Sliders,
  Share2
} from 'lucide-react';
import { Header } from './components/Header';
import { DilemmaInput } from './components/DilemmaInput';
import { TheListTab } from './components/TheListTab';
import { TheGridTab } from './components/TheGridTab';
import { TheStrategyTab } from './components/TheStrategyTab';
import { TheTiebreakerModal } from './components/TheTiebreakerModal';
import { MitigationModal } from './components/MitigationModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ShareModal } from './components/ShareModal';
import { DecisionAnalysis, DecisionItem, OptionModel, ViewTab } from './types/decision';
import { PRESET_DECISIONS } from './data/presets';
import { buildStrategicDecision } from './utils/decisionEngine';
import { Language, translations } from './utils/i18n';
import { calculateOptionScores } from './utils/calculations';

export default function App() {
  const [language, setLanguage] = useState<Language>('vi');
  const [currentDecision, setCurrentDecision] = useState<DecisionAnalysis | null>(() => {
    // Start with the popular Freemium vs Flat rate preset for instant satisfaction
    return PRESET_DECISIONS[0];
  });
  const [activeTab, setActiveTab] = useState<ViewTab>('list');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<DecisionAnalysis[]>(() => {
    try {
      const saved = localStorage.getItem('tiebreaker_history');
      return saved ? JSON.parse(saved) : PRESET_DECISIONS;
    } catch {
      return PRESET_DECISIONS;
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTiebreakerOpen, setIsTiebreakerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [mitigationTarget, setMitigationTarget] = useState<{
    item: DecisionItem;
    isCon: boolean;
    optionName: string;
  } | null>(null);

  const t = translations[language];

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tiebreaker_history', JSON.stringify(history));
    } catch {
      // ignore
    }
  }, [history]);

  // Read dilemma from URL params on load if shared
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const urlDilemma = searchParams.get('dilemma');
      const urlOptions = searchParams.get('options');
      if (urlDilemma && urlDilemma.trim().length > 0) {
        const opts = urlOptions ? urlOptions.split(',').map((s) => s.trim()).filter(Boolean) : [];
        handleAnalyze(urlDilemma, opts, '');
      }
    } catch {
      // ignore
    }
  }, []);

  // Language toggle
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  // Submit dilemma to Gemini
  const handleAnalyze = async (dilemma: string, options: string[], contextNotes: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma,
          options,
          contextNotes,
          language,
        }),
      });

      let analyzedData: any;
      if (!res.ok) {
        console.warn('API returned non-ok, activating strategic fallback engine');
        analyzedData = buildStrategicDecision(dilemma, options, contextNotes, language);
      } else {
        analyzedData = await res.json();
      }

      const newDecision: DecisionAnalysis = {
        ...analyzedData,
        id: `dec-${Date.now()}`,
        createdAt: new Date().toISOString(),
        dilemma,
        contextNotes,
        language,
      };

      setCurrentDecision(newDecision);
      setActiveTab('list');

      // Add to history
      setHistory((prev) => [newDecision, ...prev.filter((h) => h.id !== newDecision.id)]);
    } catch (err: any) {
      console.warn('Network issue encountered, generating via local strategic engine:', err);
      const fallbackDecision = buildStrategicDecision(dilemma, options, contextNotes, language);
      setCurrentDecision(fallbackDecision);
      setActiveTab('list');
      setHistory((prev) => [fallbackDecision, ...prev.filter((h) => h.id !== fallbackDecision.id)]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select a preset
  const handleSelectPreset = (preset: DecisionAnalysis) => {
    setCurrentDecision(preset);
    setLanguage(preset.language);
    setActiveTab('list');
    setError(null);
  };

  // Update option pros/cons
  const handleUpdateOption = (updatedOption: OptionModel) => {
    if (!currentDecision) return;
    const updatedOptions = currentDecision.options.map((opt) =>
      opt.id === updatedOption.id ? updatedOption : opt
    );
    const updatedDecision = { ...currentDecision, options: updatedOptions };
    setCurrentDecision(updatedDecision);

    // Update in history too
    setHistory((prev) =>
      prev.map((h) => (h.id === updatedDecision.id ? updatedDecision : h))
    );
  };

  // Update criterion weight
  const handleUpdateCriterionWeight = (criteriaId: string, newWeight: number) => {
    if (!currentDecision) return;
    const updatedCriteria = currentDecision.comparisonMatrix.criteria.map((c) =>
      c.id === criteriaId ? { ...c, weight: newWeight } : c
    );
    const updatedDecision = {
      ...currentDecision,
      comparisonMatrix: {
        ...currentDecision.comparisonMatrix,
        criteria: updatedCriteria,
      },
    };
    setCurrentDecision(updatedDecision);
  };

  // Delete decision from history
  const handleDeleteDecision = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (currentDecision?.id === id) {
      setCurrentDecision(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* App Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onNewDecision={() => {
          setCurrentDecision(null);
          setError(null);
        }}
        savedCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-slate-400 hover:text-white text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* VIEW A: No Dilemma Loaded -> Show Input Screen */}
        {!currentDecision ? (
          <DilemmaInput
            language={language}
            onAnalyze={handleAnalyze}
            onSelectPreset={handleSelectPreset}
            isLoading={isAnalyzing}
          />
        ) : (
          /* VIEW B: Dilemma Active -> Workspace with 4 Tabs & Tiebreaker Verdict */
          <div className="space-y-6">
            {/* Dilemma Hero Banner */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentDecision(null)}
                      className="text-xs font-semibold text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>{language === 'vi' ? 'Đổi vấn đề' : 'Change dilemma'}</span>
                    </button>
                    <span className="text-slate-700">•</span>
                    <span className="text-[11px] text-amber-400/90 font-mono">
                      {currentDecision.options.length} {language === 'vi' ? 'Lựa chọn' : 'Options'}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                    {currentDecision.dilemma}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-4xl">
                    {currentDecision.summary}
                  </p>
                </div>

                {/* Actions: Share & Tiebreaker Trigger */}
                <div className="shrink-0 pt-2 lg:pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsShareOpen(true)}
                    className="px-4 py-3.5 rounded-2xl font-bold text-xs text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                    title={language === 'vi' ? 'Chia sẻ bài toán này cho bạn bè' : 'Share this dilemma with friends'}
                  >
                    <Share2 className="w-4 h-4 text-amber-400 stroke-[2.2]" />
                    <span>{t.share}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsTiebreakerOpen(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer border border-amber-300/40"
                  >
                    <Scale className="w-5 h-5 stroke-[2.5]" />
                    <span>{t.tiebreakerBtn}</span>
                    <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                  </button>
                </div>
              </div>

              {/* Initial AI Verdict Teaser Card */}
              {currentDecision.verdict && (
                <div className="mt-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        {t.verdictHeader}
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-slate-100">
                        {currentDecision.verdict.headline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs text-slate-400 font-mono">
                      {t.confidence}: <span className="text-amber-400 font-bold">{currentDecision.verdict.confidenceScore}%</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsTiebreakerOpen(true)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'vi' ? 'Xem phán quyết chi tiết' : 'Explore verdict'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-800/80 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'list'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                <span>{t.tabList}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('grid')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'grid'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Table className="w-4 h-4" />
                <span>{t.tabGrid}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('strategy')}
                className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'strategy'
                    ? 'border-amber-500 text-amber-400 bg-amber-500/5 rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{t.tabStrategy}</span>
              </button>
            </div>

            {/* Active Tab View */}
            <div className="pt-2">
              {activeTab === 'list' && (
                <TheListTab
                  decision={currentDecision}
                  language={language}
                  onUpdateOption={handleUpdateOption}
                  onRequestMitigation={(item, isCon, optionName) =>
                    setMitigationTarget({ item, isCon, optionName })
                  }
                />
              )}

              {activeTab === 'grid' && (
                <TheGridTab
                  decision={currentDecision}
                  language={language}
                  onUpdateCriterionWeight={handleUpdateCriterionWeight}
                />
              )}

              {activeTab === 'strategy' && (
                <TheStrategyTab
                  decision={currentDecision}
                  language={language}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(d) => {
          setCurrentDecision(d);
          setLanguage(d.language);
          setActiveTab('list');
        }}
        onDeleteDecision={handleDeleteDecision}
        currentDecision={currentDecision}
        language={language}
      />

      {/* The Tiebreaker Modal */}
      {isTiebreakerOpen && currentDecision && (
        <TheTiebreakerModal
          decision={currentDecision}
          language={language}
          onClose={() => setIsTiebreakerOpen(false)}
        />
      )}

      {/* Reality Check / Mitigation Modal */}
      {mitigationTarget && currentDecision && (
        <MitigationModal
          item={mitigationTarget.item}
          isCon={mitigationTarget.isCon}
          optionName={mitigationTarget.optionName}
          dilemma={currentDecision.dilemma}
          language={language}
          onClose={() => setMitigationTarget(null)}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        language={language}
        currentDecision={currentDecision}
      />
    </div>
  );
}
