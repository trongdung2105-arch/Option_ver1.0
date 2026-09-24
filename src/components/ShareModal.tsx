import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Users, 
  Sparkles, 
  Smartphone, 
  Send,
  MessageCircle
} from 'lucide-react';
import { Language } from '../utils/i18n';
import { DecisionAnalysis } from '../types/decision';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  currentDecision: DecisionAnalysis | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  language,
  currentDecision,
}) => {
  const [copiedApp, setCopiedApp] = useState(false);
  const [copiedDilemma, setCopiedDilemma] = useState(false);

  if (!isOpen) return null;

  const isVi = language === 'vi';

  // Compute public share URL (prefer ais-pre URL for public access)
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const publicBaseUrl = origin.includes('ais-dev-')
    ? origin.replace('ais-dev-', 'ais-pre-')
    : origin || 'https://ais-pre-qs7uvyblbbuiznvqzy7guu-157838402947.asia-southeast1.run.app';

  // URL for specific dilemma
  let dilemmaShareUrl = publicBaseUrl;
  if (currentDecision?.dilemma) {
    const params = new URLSearchParams();
    params.set('dilemma', currentDecision.dilemma);
    if (currentDecision.options?.length > 0) {
      params.set('options', currentDecision.options.map((o) => o.name).join(','));
    }
    dilemmaShareUrl = `${publicBaseUrl}?${params.toString()}`;
  }

  const handleCopyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicBaseUrl);
      setCopiedApp(true);
      setTimeout(() => setCopiedApp(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCopyDilemmaUrl = async () => {
    try {
      await navigator.clipboard.writeText(dilemmaShareUrl);
      setCopiedDilemma(true);
      setTimeout(() => setCopiedDilemma(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Tiebreaker - AI Strategic Decision Advisor',
          text: currentDecision?.dilemma
            ? (isVi 
                ? `Cùng mình giải quyết bài toán này nhé: "${currentDecision.dilemma}"`
                : `Help me decide on this dilemma: "${currentDecision.dilemma}"`)
            : (isVi
                ? 'Thử ứng dụng The Tiebreaker để chốt hạ các quyết định khó khăn cùng AI!'
                : 'Try The Tiebreaker to resolve tough strategic decisions with AI!'),
          url: currentDecision?.dilemma ? dilemmaShareUrl : publicBaseUrl,
        });
      } catch {
        // user cancelled share
      }
    } else {
      handleCopyDilemmaUrl();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {isVi ? 'Chia sẻ với bạn bè' : 'Share with Friends'}
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {isVi ? 'Công khai' : 'Public Link'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isVi 
                  ? 'Gửi đường link này để bạn bè mở trực tiếp trên điện thoại hoặc máy tính' 
                  : 'Send this link so friends can access directly on phone or desktop'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          {/* Option 1: Share current dilemma (if active) */}
          {currentDecision && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-slate-800/40 to-slate-900 border border-amber-500/30">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isVi ? '1. Link kèm bài toán quyết định hiện tại' : '1. Link with Current Dilemma'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isVi ? 'Khuyên dùng để hỏi ý kiến' : 'Recommended for advice'}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium line-clamp-1 mb-2.5 italic">
                "{currentDecision.dilemma}"
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={dilemmaShareUrl}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-300 select-all focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyDilemmaUrl}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                    copiedDilemma
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  }`}
                >
                  {copiedDilemma ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isVi ? 'Đã chép!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{isVi ? 'Sao chép' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Option 2: General App Link */}
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                {isVi ? '2. Link ứng dụng gốc (Trang chủ)' : '2. Main App Link'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isVi ? 'Để bạn bè tự tạo quyết định mới' : 'For friends to start fresh'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicBaseUrl}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950/80 border border-slate-700/80 rounded-lg text-slate-300 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyAppUrl}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  copiedApp
                    ? 'bg-emerald-500 text-slate-950 font-extrabold'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {copiedApp ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isVi ? 'Đã chép!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isVi ? 'Sao chép' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native Share button (great for mobile) */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>
              {isVi 
                ? 'Gửi qua Zalo, Messenger, Tin nhắn (Native Share)' 
                : 'Share via Mobile Apps / Messenger'}
            </span>
          </button>

          {/* Friendly Note */}
          <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1.5">
              💡 {isVi ? 'Bạn bè của bạn cần làm gì?' : 'What do friends need to do?'}
            </p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>{isVi ? 'Chỉ cần nhấp vào link là mở được ngay, không cần đăng nhập hay cài đặt.' : 'Click to open directly, no login or installation needed.'}</li>
              <li>{isVi ? 'Hoạt động hoàn hảo trên cả điện thoại (giao diện vuốt thẻ) và máy tính.' : 'Works smoothly on both mobile (swipe cards) and desktop.'}</li>
              <li>{isVi ? 'Bạn bè có thể kéo thanh trượt chấm điểm, bấm nút "Chốt hạ" hoặc nhập tình huống của riêng họ.' : 'Friends can adjust sliders, press the Tiebreaker verdict, or enter their own dilemmas.'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
