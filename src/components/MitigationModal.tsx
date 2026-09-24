import React, { useEffect, useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  HelpCircle, 
  X, 
  Loader2 
} from 'lucide-react';
import { DecisionItem } from '../types/decision';
import { Language, translations } from '../utils/i18n';

interface MitigationModalProps {
  item: DecisionItem;
  isCon: boolean;
  optionName: string;
  dilemma: string;
  language: Language;
  onClose: () => void;
}

interface MitigationData {
  realityCheck: string;
  strategicMitigation: string;
  testQuestion: string;
}

export const MitigationModal: React.FC<MitigationModalProps> = ({
  item,
  isCon,
  optionName,
  dilemma,
  language,
  onClose,
}) => {
  const t = translations[language];
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MitigationData | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchMitigation = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/mitigate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemText: item.text,
            itemType: isCon ? 'Con / Risk' : 'Pro / Benefit',
            optionName,
            dilemma,
            language,
          }),
        });

        if (!res.ok) throw new Error('Failed to fetch mitigation');
        const resData = await res.json();
        if (isMounted) setData(resData);
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setData({
            realityCheck: isCon
              ? (language === 'vi' ? 'Rủi ro này có thật nhưng hoàn toàn có thể kiểm soát bằng quy trình rõ ràng.' : 'This risk is real but controllable with proper operational boundaries.')
              : (language === 'vi' ? 'Lợi thế này phụ thuộc vào năng lực thực thi và sự kiên trì.' : 'This benefit compounds when execution consistency is sustained.'),
            strategicMitigation: isCon
              ? (language === 'vi' ? 'Đặt ra giới hạn ngân sách và thời hạn thử nghiệm (Time-box) 30 ngày.' : 'Set a strict 30-day trial checkpoint with clear metrics.')
              : (language === 'vi' ? 'Tập trung toàn lực khai thác ưu thế này ngay trong 2 tuần đầu.' : 'Double down on this advantage in your first two weeks.'),
            testQuestion: language === 'vi'
              ? 'Nếu rủi ro xấu nhất xảy ra, bạn có phương án dự phòng nào để sống sót?'
              : 'If the worst-case scenario occurs, what is your immediate fallback?',
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMitigation();
    return () => {
      isMounted = false;
    };
  }, [item, isCon, optionName, dilemma, language]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                {isCon ? (language === 'vi' ? 'Gỡ rối & Giảm thiểu Rủi ro' : 'Risk Mitigation') : (language === 'vi' ? 'Khai phóng Ưu điểm' : 'Advantage Amplifier')}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mt-1">{item.text}</h4>
            <span className="text-xs text-slate-400">
              {optionName} • {item.category || (isCon ? 'Risk' : 'Advantage')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            <p className="text-xs">
              {language === 'vi' ? 'Đang phân tích phản biện chiến lược...' : 'Analyzing strategic mitigation...'}
            </p>
          </div>
        ) : (
          data && (
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Reality check */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'vi' ? 'Kiểm tra Thực tế (Reality Check)' : 'Reality Check'}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{data.realityCheck}</p>
              </div>

              {/* Strategic mitigation */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Hành động Hóa giải / Tối ưu hóa' : 'Actionable Mitigation'}</span>
                </div>
                <p className="text-amber-100/90 leading-relaxed">{data.strategicMitigation}</p>
              </div>

              {/* Test question */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-300 text-xs">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'vi' ? 'Câu hỏi Quyết định Cốt lõi' : 'Decisive Acid Test'}</span>
                </div>
                <p className="text-slate-200 italic leading-relaxed">"{data.testQuestion}"</p>
              </div>
            </div>
          )
        )}

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 cursor-pointer"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
