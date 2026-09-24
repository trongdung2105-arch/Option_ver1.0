import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Plus, 
  Trash2, 
  Sparkles, 
  ShieldAlert, 
  Sliders, 
  Check, 
  X,
  Scale
} from 'lucide-react';
import { DecisionAnalysis, DecisionItem, OptionModel } from '../types/decision';
import { Language, translations } from '../utils/i18n';
import { calculateOptionScores } from '../utils/calculations';

interface TheListTabProps {
  decision: DecisionAnalysis;
  language: Language;
  onUpdateOption: (updatedOption: OptionModel) => void;
  onRequestMitigation: (item: DecisionItem, isCon: boolean, optionName: string) => void;
}

export const TheListTab: React.FC<TheListTabProps> = ({
  decision,
  language,
  onUpdateOption,
  onRequestMitigation,
}) => {
  const t = translations[language];
  const [selectedOptionId, setSelectedOptionId] = useState<string>(decision.options[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState<{ optionId: string; isPro: boolean } | null>(null);
  const [newItemText, setNewItemText] = useState('');
  const [newItemExplanation, setNewItemExplanation] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(5);

  const activeOption = decision.options.find((o) => o.id === selectedOptionId) || decision.options[0];

  // Weight change handlers
  const handleWeightChange = (optionId: string, itemId: string, isPro: boolean, newWeight: number) => {
    const opt = decision.options.find((o) => o.id === optionId);
    if (!opt) return;

    const updated = { ...opt };
    if (isPro) {
      updated.pros = updated.pros.map((p) => (p.id === itemId ? { ...p, weight: newWeight } : p));
    } else {
      updated.cons = updated.cons.map((c) => (c.id === itemId ? { ...c, weight: newWeight } : c));
    }
    onUpdateOption(updated);
  };

  // Delete item handler
  const handleDeleteItem = (optionId: string, itemId: string, isPro: boolean) => {
    const opt = decision.options.find((o) => o.id === optionId);
    if (!opt) return;

    const updated = { ...opt };
    if (isPro) {
      updated.pros = updated.pros.filter((p) => p.id !== itemId);
    } else {
      updated.cons = updated.cons.filter((c) => c.id !== itemId);
    }
    onUpdateOption(updated);
  };

  // Add item handler
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAddModal || !newItemText.trim()) return;

    const opt = decision.options.find((o) => o.id === showAddModal.optionId);
    if (!opt) return;

    const newItem: DecisionItem = {
      id: `custom-${Date.now()}`,
      text: newItemText.trim(),
      explanation: newItemExplanation.trim() || newItemText.trim(),
      category: newItemCategory.trim() || (showAddModal.isPro ? 'Ưu điểm' : 'Rủi ro'),
      weight: Number(newItemWeight),
    };

    const updated = { ...opt };
    if (showAddModal.isPro) {
      updated.pros = [...updated.pros, newItem];
    } else {
      updated.cons = [...updated.cons, newItem];
    }

    onUpdateOption(updated);
    setShowAddModal(null);
    setNewItemText('');
    setNewItemExplanation('');
    setNewItemCategory('');
    setNewItemWeight(5);
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-wrap gap-2">
          {decision.options.map((opt, idx) => {
            const isSelected = opt.id === (activeOption?.id || '');
            const scores = calculateOptionScores(
              opt,
              decision.comparisonMatrix.criteria,
              decision.comparisonMatrix.scores
            );

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedOptionId(opt.id)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="truncate max-w-[200px] sm:max-w-none">{opt.name}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Net: {scores.netScore > 0 ? `+${scores.netScore}` : scores.netScore}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Net Balance Bar */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-slate-950/80 border border-slate-800/80 rounded-xl">
          <Scale className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300">{t.balanceScale}:</span>
          <div className="flex items-center gap-2 text-xs">
            {decision.options.map((opt) => {
              const sc = calculateOptionScores(
                opt,
                decision.comparisonMatrix.criteria,
                decision.comparisonMatrix.scores
              );
              return (
                <div key={opt.id} className="flex items-center gap-1">
                  <span className="text-slate-400 text-[11px] truncate max-w-[90px]">{opt.name}:</span>
                  <span className={`font-mono font-bold ${sc.netScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sc.netScore >= 0 ? `+${sc.netScore}` : sc.netScore}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Option Header Card */}
      {activeOption && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800/90 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>{activeOption.name}</span>
              </h3>
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium mt-0.5">
                {activeOption.tagline}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl">
                {activeOption.description}
              </p>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-3 self-start sm:self-center shrink-0">
              {(() => {
                const sc = calculateOptionScores(
                  activeOption,
                  decision.comparisonMatrix.criteria,
                  decision.comparisonMatrix.scores
                );
                return (
                  <div className="text-right p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Composite Power
                    </div>
                    <div className="text-lg font-black text-amber-400 font-mono">
                      {sc.compositeScore}%
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Pros & Cons Columns */}
      {activeOption && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PROS COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <ThumbsUp className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-emerald-300">
                  {t.pros} ({activeOption.pros.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal({ optionId: activeOption.id, isPro: true })}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addPro}
              </button>
            </div>

            <div className="space-y-3">
              {activeOption.pros.map((item) => {
                // Visual weighting scale
                const weightRatio = item.weight / 10;
                const borderOpacity = 0.2 + (weightRatio * 0.6);

                return (
                  <div
                    key={item.id}
                    style={{
                      borderColor: `rgba(16, 185, 129, ${borderOpacity})`,
                    }}
                    className="group relative p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 transition-all duration-200 shadow-sm border"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        {item.category && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                            {item.category}
                          </span>
                        )}
                        <h5 className="text-sm font-bold text-slate-100 group-hover:text-emerald-200 transition-colors">
                          {item.text}
                        </h5>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRequestMitigation(item, false, activeOption.name)}
                          title="Reality Check / Maximize with AI"
                          className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(activeOption.id, item.id, true)}
                          title="Delete"
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {item.explanation}
                    </p>

                    {/* Interactive Weight Slider (1-10) */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Sliders className="w-3 h-3 text-emerald-400" />
                        {t.importance}
                      </span>
                      <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={item.weight}
                          onChange={(e) =>
                            handleWeightChange(activeOption.id, item.id, true, Number(e.target.value))
                          }
                          className="w-full accent-emerald-500 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-xs text-emerald-400 w-5 text-right">
                          {item.weight}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CONS COLUMN */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-500/30">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <ThumbsDown className="w-4 h-4" />
                </div>
                <h4 className="text-base font-bold text-rose-300">
                  {t.cons} ({activeOption.cons.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal({ optionId: activeOption.id, isPro: false })}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t.addCon}
              </button>
            </div>

            <div className="space-y-3">
              {activeOption.cons.map((item) => {
                const weightRatio = item.weight / 10;
                const borderOpacity = 0.2 + (weightRatio * 0.6);

                return (
                  <div
                    key={item.id}
                    style={{
                      borderColor: `rgba(244, 63, 94, ${borderOpacity})`,
                    }}
                    className="group relative p-4 rounded-xl bg-slate-900/70 hover:bg-slate-900 transition-all duration-200 shadow-sm border"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        {item.category && (
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-1">
                            {item.category}
                          </span>
                        )}
                        <h5 className="text-sm font-bold text-slate-100 group-hover:text-rose-200 transition-colors">
                          {item.text}
                        </h5>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => onRequestMitigation(item, true, activeOption.name)}
                          title="Mitigate risk with AI"
                          className="px-2 py-0.5 rounded text-[11px] font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>{t.mitigate}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(activeOption.id, item.id, false)}
                          title="Delete"
                          className="p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {item.explanation}
                    </p>

                    {/* Interactive Weight Slider (1-10) */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Sliders className="w-3 h-3 text-rose-400" />
                        {t.importance}
                      </span>
                      <div className="flex items-center gap-2 flex-1 max-w-[180px]">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={item.weight}
                          onChange={(e) =>
                            handleWeightChange(activeOption.id, item.id, false, Number(e.target.value))
                          }
                          className="w-full accent-rose-500 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-xs text-rose-400 w-5 text-right">
                          {item.weight}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add New Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                {showAddModal.isPro ? (
                  <>
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>{t.addPro}</span>
                  </>
                ) : (
                  <>
                    <ThumbsDown className="w-4 h-4 text-rose-400" />
                    <span>{t.addCon}</span>
                  </>
                )}
              </h4>
              <button
                type="button"
                onClick={() => setShowAddModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.itemText}
                </label>
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder={showAddModal.isPro ? 'Ví dụ: Tăng doanh thu 30%' : 'Ví dụ: Chi phí vận hành cao'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  {t.itemExpl}
                </label>
                <textarea
                  value={newItemExplanation}
                  onChange={(e) => setNewItemExplanation(e.target.value)}
                  rows={2}
                  placeholder="Lý do chi tiết..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Danh mục (Category)
                  </label>
                  <input
                    type="text"
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    placeholder="Tài chính, Thời gian..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    {t.importance} ({newItemWeight}/10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(Number(e.target.value))}
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400"
                >
                  {t.saveItem}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
