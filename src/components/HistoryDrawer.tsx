import React from 'react';
import { 
  X, 
  Trash2, 
  Download, 
  ExternalLink, 
  Calendar, 
  Clock, 
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { DecisionAnalysis } from '../types/decision';
import { Language, translations } from '../utils/i18n';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  currentDecision: DecisionAnalysis | null;
  language: Language;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onDeleteDecision,
  currentDecision,
  language,
}) => {
  const t = translations[language];
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleExportMarkdown = (dec: DecisionAnalysis) => {
    let md = `# The Tiebreaker Analysis: ${dec.dilemma}\n\n`;
    md += `> **Date:** ${new Date(dec.createdAt).toLocaleDateString()}\n\n`;
    md += `## Executive Summary\n${dec.summary}\n\n`;

    md += `## The Tiebreaker Verdict\n`;
    md += `**Recommended Option:** ${dec.verdict.headline}\n\n`;
    md += `${dec.verdict.rationale}\n\n`;
    md += `**Confidence:** ${dec.verdict.confidenceScore}%\n\n`;

    md += `### Options & Pros / Cons\n\n`;
    dec.options.forEach((opt) => {
      md += `### ${opt.name} (${opt.tagline})\n`;
      md += `${opt.description}\n\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach((p) => {
        md += `- [${p.weight}/10] **${p.text}**: ${p.explanation}\n`;
      });
      md += `\n**Cons:**\n`;
      opt.cons.forEach((c) => {
        md += `- [${c.weight}/10] **${c.text}**: ${c.explanation}\n`;
      });
      md += `\n**SWOT Summary:**\n`;
      md += `- Strengths: ${opt.swot.strengths.join(', ')}\n`;
      md += `- Weaknesses: ${opt.swot.weaknesses.join(', ')}\n`;
      md += `- Opportunities: ${opt.swot.opportunities.join(', ')}\n`;
      md += `- Threats: ${opt.swot.threats.join(', ')}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tiebreaker-${dec.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = (dec: DecisionAnalysis) => {
    const summaryText = `[The Tiebreaker] ${dec.dilemma}\nVerdict: ${dec.verdict.headline}\n${dec.verdict.rationale}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">{t.history}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {history.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Decision Quick Actions */}
        {currentDecision && (
          <div className="p-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-400">
              {language === 'vi' ? 'Quyết định hiện tại:' : 'Current Dilemma:'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopySummary(currentDecision)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? t.copied : t.share}</span>
              </button>
              <button
                type="button"
                onClick={() => handleExportMarkdown(currentDecision)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t.exportMd}</span>
              </button>
            </div>
          </div>
        )}

        {/* List of decisions */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs sm:text-sm space-y-2">
              <FileText className="w-8 h-8 mx-auto text-slate-600" />
              <p>{t.noHistory}</p>
            </div>
          ) : (
            history.map((item) => {
              const isCurrent = currentDecision?.id === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all space-y-2.5 ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="text-xs sm:text-sm font-bold text-slate-200 hover:text-amber-300 cursor-pointer line-clamp-2"
                    >
                      {item.dilemma}
                    </h4>
                    <button
                      type="button"
                      onClick={() => onDeleteDecision(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-amber-400/90 font-medium line-clamp-1">
                    🎯 {item.verdict.headline}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="text-amber-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{language === 'vi' ? 'Xem lại' : 'Revisit'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
