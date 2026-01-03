
import React, { useState, useEffect } from 'react';
import { X, Check, Coins, Send, Sparkles, PartyPopper, ChevronRight, ListChecks, MessageSquare } from 'lucide-react';
import { Campaign } from '../types';

interface VoteOverlayProps {
  campaign: Campaign;
  initialSelection?: 'A' | 'B' | null;
  onClose: () => void;
  onComplete: (points: number) => void;
}

type Step = 'pick' | 'objective' | 'insight' | 'result';

const VoteOverlay: React.FC<VoteOverlayProps> = ({ campaign, initialSelection, onClose, onComplete }) => {
  const [step, setStep] = useState<Step>(() => {
    if (initialSelection) {
      return campaign.objectiveQuestion ? 'objective' : 'insight';
    }
    return 'pick';
  });

  const [selected, setSelected] = useState<'A' | 'B' | null>(initialSelection || null);
  const [objectiveAnswer, setObjectiveAnswer] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 250);
  };

  const handlePick = (side: 'A' | 'B') => {
    setSelected(side);
    setTimeout(() => {
      setPointsEarned(campaign.rewardLight);
      setStep(campaign.objectiveQuestion ? 'objective' : 'insight');
    }, 400);
  };

  const handleObjectiveSelect = (option: string) => {
    setObjectiveAnswer(option);
    setTimeout(() => {
      setStep('insight');
    }, 300);
  };

  const handleSkipInsight = () => {
    onComplete(campaign.rewardLight);
    setStep('result');
  };

  const handleSubmitInsight = () => {
    if (reason.length < 5) return;
    const total = campaign.rewardLight + campaign.rewardDeep;
    setPointsEarned(total);
    setStep('result');
    onComplete(total);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-5 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Dimmer Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-[4px] transition-all" 
        onClick={handleClose}
      />

      {/* Centered Modal Content */}
      <div className={`relative bg-white w-full max-w-[360px] max-h-[85vh] rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isClosing ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {step === 'result' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#DFFF00] blur-[40px] opacity-40 animate-pulse rounded-full" />
              <div className="relative w-24 h-24 bg-black rounded-[2rem] flex items-center justify-center text-[#DFFF00] shadow-2xl rotate-12">
                <PartyPopper size={48} />
              </div>
            </div>
            <h2 className="text-3xl font-black mb-2 italic tracking-tighter uppercase">Awesome!</h2>
            <p className="text-slate-500 font-bold mb-8 leading-relaxed text-sm">
              당신의 의견이 셀러에게 전달되었습니다.<br/>리워드가 즉시 적립되었습니다.
            </p>
            <div className="bg-slate-50 border-2 border-slate-100 rounded-[2rem] p-6 w-full mb-8">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Reward</p>
              <div className="flex items-center justify-center gap-2">
                <Coins size={24} className="text-[#A020F0]" />
                <span className="text-3xl font-black text-black">+{pointsEarned}P</span>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-md shadow-2xl active:scale-95 transition-all"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <header className="px-6 pt-6 pb-4 flex justify-between items-center bg-white shrink-0">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-[#A020F0] tracking-[0.2em] uppercase mb-0.5">
                  {step === 'pick' && 'Step 1: Quick Pick'}
                  {step === 'objective' && 'Step 2: Key Insight'}
                  {step === 'insight' && 'Step 3: Deep Insight'}
                </span>
                <h1 className="text-lg font-black truncate max-w-[180px]">{campaign.title}</h1>
              </div>
              <button 
                onClick={handleClose} 
                className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-transform"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 pb-8 no-scrollbar">
              {step === 'pick' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center space-y-1 mt-2">
                    <h2 className="text-xl font-black leading-tight">더 끌리는 디자인을<br/>선택해주세요!</h2>
                    <p className="text-[11px] text-slate-400 font-bold">하나만 골라도 {campaign.rewardLight}P 즉시 지급</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 h-[280px]">
                    <div 
                      onClick={() => handlePick('A')}
                      className={`relative rounded-[2rem] overflow-hidden border-[3px] transition-all duration-300 cursor-pointer ${
                        selected === 'A' ? 'border-[#A020F0] scale-105 z-10 shadow-xl' : 'border-transparent active:scale-95'
                      }`}
                    >
                      <img src={campaign.thumbnailA} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md w-8 h-8 rounded-xl flex items-center justify-center font-black text-md shadow-lg">A</div>
                      {selected === 'A' && <div className="absolute inset-0 bg-[#A020F0]/20 flex items-center justify-center"><Check size={48} className="text-white drop-shadow-xl" strokeWidth={4} /></div>}
                    </div>
                    <div 
                      onClick={() => handlePick('B')}
                      className={`relative rounded-[2rem] overflow-hidden border-[3px] transition-all duration-300 cursor-pointer ${
                        selected === 'B' ? 'border-[#A020F0] scale-105 z-10 shadow-xl' : 'border-transparent active:scale-95'
                      }`}
                    >
                      <img src={campaign.thumbnailB} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md w-8 h-8 rounded-xl flex items-center justify-center font-black text-md shadow-lg">B</div>
                      {selected === 'B' && <div className="absolute inset-0 bg-[#A020F0]/20 flex items-center justify-center"><Check size={48} className="text-white drop-shadow-xl" strokeWidth={4} /></div>}
                    </div>
                  </div>
                </div>
              )}

              {step === 'objective' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-400">
                  <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div className="w-12 h-14 bg-white rounded-lg overflow-hidden shadow-sm shrink-0">
                        <img src={selected === 'A' ? campaign.thumbnailA : campaign.thumbnailB} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[8px] font-black text-[#A020F0] uppercase mb-0.5">Selection: Option {selected}</p>
                        <p className="text-[10px] font-bold text-slate-500 leading-tight truncate">선택 항목에 대한 추가 질문입니다.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-7 h-7 bg-[#DFFF00] text-black rounded-lg flex items-center justify-center shrink-0"><ListChecks size={16} /></div>
                        <h2 className="text-md font-black leading-tight">{campaign.objectiveQuestion}</h2>
                    </div>

                    <div className="grid gap-2">
                        {campaign.objectiveOptions?.map((option, idx) => (
                          <button 
                              key={idx}
                              onClick={() => handleObjectiveSelect(option)}
                              className={`w-full p-4 text-left rounded-xl border-2 transition-all flex justify-between items-center group ${
                                objectiveAnswer === option 
                                ? 'border-[#A020F0] bg-[#A020F0]/5' 
                                : 'border-slate-100 bg-white hover:border-slate-300'
                              }`}
                          >
                              <span className={`text-sm font-bold ${objectiveAnswer === option ? 'text-[#A020F0]' : 'text-slate-700'}`}>{option}</span>
                              <ChevronRight size={16} className={objectiveAnswer === option ? 'text-[#A020F0]' : 'text-slate-300 group-hover:text-slate-500'} />
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 'insight' && (
                <div className="space-y-6 animate-in slide-in-from-right duration-400">
                  <div className="bg-[#A020F0]/5 border border-[#A020F0]/10 p-5 rounded-[2rem] relative overflow-hidden">
                    <Sparkles className="absolute -top-1 -right-1 text-[#A020F0]/10" size={60} />
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#A020F0] text-white px-2 py-0.5 rounded-full text-[8px] font-black uppercase">Bonus reward</div>
                    </div>
                    <h2 className="text-lg font-black mb-1 leading-tight">{campaign.subjectiveQuestion || '이유를 적어주세요!'}</h2>
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">인사이트가 깊을수록 보상이 커집니다.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end px-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Your Insight</label>
                      <span className={`text-[8px] font-bold ${reason.length < 5 ? 'text-slate-300' : 'text-[#A020F0]'}`}>{reason.length} / 100</span>
                    </div>
                    <textarea 
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="구체적인 이유를 적고 리워드 5배 받기!"
                      className="w-full h-32 bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 focus:outline-none focus:border-[#A020F0] focus:bg-white transition-all font-bold text-sm text-slate-800"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={handleSubmitInsight}
                      disabled={reason.length < 5}
                      className="w-full py-4 bg-black text-white rounded-2xl font-black text-md flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all disabled:opacity-20"
                    >
                      5배 보상 받기 (+{campaign.rewardDeep}P)
                      <Send size={16} className="text-[#DFFF00]" />
                    </button>
                    <button 
                      onClick={handleSkipInsight}
                      className="w-full py-2 text-slate-400 font-black text-[11px] hover:text-slate-600 transition-colors"
                    >
                      기본 보상만 받을래요
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VoteOverlay;
