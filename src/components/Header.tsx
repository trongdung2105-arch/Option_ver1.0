import React from 'react';
import { Scale, History, PlusCircle, Globe, Sparkles, Share2 } from 'lucide-react';
import { Language, translations } from '../utils/i18n';

interface HeaderProps {
  language: Language;
  onToggleLanguage: () => void;
  onOpenHistory: () => void;
  onNewDecision: () => void;
  onOpenShare: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenHistory,
  onNewDecision,
  onOpenShare,
  savedCount,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div 
          onClick={onNewDecision}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-300 rounded-full animate-ping opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-white to-amber-400 bg-clip-text text-transparent">
                {t.appName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                <Sparkles className="w-2.5 h-2.5" />
                AI Strategic Advisor
              </span>
            </div>
            <p className="hidden md:block text-xs text-slate-400 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Share Button */}
          <button
            type="button"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all cursor-pointer"
            title={language === 'vi' ? 'Chia sẻ với bạn bè' : 'Share with friends'}
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
            <span className="hidden sm:inline">{t.share}</span>
          </button>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer"
            title="Switch Language / Đổi ngôn ngữ"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'vi' ? 'Tiếng Việt' : 'English'}</span>
          </button>

          {/* History Drawer Trigger */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{t.history}</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            type="button"
            onClick={onNewDecision}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer font-bold"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.newDecision}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
