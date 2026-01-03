
import React, { useState, useEffect } from 'react';
import { Sparkles, Link, Check, ArrowRight, Image as ImageIcon, ChevronLeft, Target, MessageSquarePlus, Send, Users2, Search, Zap, PartyPopper, CheckCircle2, ListChecks, MessageSquare, Plus, Trash2, AlertCircle, ToggleLeft as Toggle } from 'lucide-react';

interface CreateCampaignFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ANALYSIS_RESULTS = [
  {
    id: 1,
    label: "HERO SECTION",
    title: "도입부 첫인상 & 후킹",
    desc: "상세페이지 최상단 이미지입니다. 고객이 이탈하지 않고 더 읽어보게 만들만큼 매력적인지 테스트합니다.",
    suggestion: "질문 제안: '이 제품을 처음 봤을 때 가장 눈에 띄는 포인트는 무엇인가요?'",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=200&q=80", 
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80"
    ]
  },
  {
    id: 2,
    label: "TECHNICAL SPECS",
    title: "내구성 및 신뢰 구간",
    desc: "제품의 소재와 하중 테스트 결과입니다. 온라인 구매 시의 불안감을 충분히 해소해주는지 확인합니다.",
    suggestion: "질문 제안: '이 설명을 읽고 나서 제품의 품질에 대해 신뢰가 가시나요?'",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=200&q=80", 
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=200&q=80"
    ]
  },
  {
    id: 3,
    label: "LIFESTYLE",
    title: "실제 연출 및 분위기",
    desc: "감성적인 공간 연출샷입니다. 타깃 고객의 라이프스타일에 이 제품이 자연스럽게 스며드는지 묻습니다.",
    suggestion: "질문 제안: '당신의 방에 이 제품이 놓인 모습이 자연스럽게 연상되나요?'",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=200&q=80", 
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&w=200&q=80"
    ]
  }
];

const TARGET_AGES = ['10대', '20대', '30대', '40대+'];
const TARGET_INTERESTS = ['패션', '뷰티', '라이프', '테크', '스포츠'];

type CreationMode = 'choice' | 'direct' | 'ai';

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({ onSuccess, onCancel }) => {
  const [mode, setMode] = useState<CreationMode>('choice');
  const [step, setStep] = useState<number>(1);
  const [isFinished, setIsFinished] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [targetGoal, setTargetGoal] = useState(100);
  
  const [targetGender, setTargetGender] = useState<'all' | 'male' | 'female'>('all');
  const [selectedAges, setSelectedAges] = useState<string[]>(['20대', '30대']);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['패션']);

  // Questions Configuration States
  const [objectiveEnabled, setObjectiveEnabled] = useState(true);
  const [objectiveQuestion, setObjectiveQuestion] = useState('이 디자인의 가장 큰 매력은?');
  const [objectiveOptions, setObjectiveOptions] = useState(['컬러감', '핏감', '소재의 고급감']);
  const [othersEnabled, setOthersEnabled] = useState(false);

  const [subjectiveEnabled, setSubjectiveEnabled] = useState(false);
  const [subjectiveQuestion, setSubjectiveQuestion] = useState('위 옵션을 선택하신 구체적인 이유가 궁금해요!');

  const QUESTION_MAX_LENGTH = 40;
  const OPTION_MAX_LENGTH = 20;

  const [loadingStep, setLoadingStep] = useState(0);
  const loadingMessages = ["데이터 수집 중...", "상세페이지 스캔 중...", "구매 트리거 분석 중...", "섹션 클러스터링 완료!"];

  const handleStartAIAnalysis = () => {
    if (!url) return;
    setStep(2);
    setLoadingStep(0);
  };

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev >= 3) {
            clearInterval(interval);
            setTimeout(() => setStep(3), 800);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleSelectCluster = (id: number) => {
    setSelectedCluster(id);
    const cluster = ANALYSIS_RESULTS.find(c => c.id === id);
    if (cluster) {
      setTitle(`${cluster.title} 검증 캠페인`);
      setObjectiveQuestion(cluster.suggestion.split("'")[1] || cluster.title);
    }
  };

  const toggleAge = (age: string) => {
    setSelectedAges(prev => 
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleAddOption = () => {
    if (objectiveOptions.length < 4) {
      setObjectiveOptions([...objectiveOptions, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    setObjectiveOptions(objectiveOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...objectiveOptions];
    newOptions[index] = value;
    setObjectiveOptions(newOptions);
  };

  const handleStartCampaign = () => {
    setIsFinished(true);
  };

  // Validation Logic
  const isObjectiveValid = !objectiveEnabled || (objectiveEnabled && objectiveQuestion && objectiveOptions.length >= 2 && objectiveOptions.every(o => o.trim().length > 0));
  const isSubjectiveValid = !subjectiveEnabled || (subjectiveEnabled && subjectiveQuestion.trim().length > 0);
  const isAnyQuestionEnabled = objectiveEnabled || subjectiveEnabled;
  const isFinalStepValid = isObjectiveValid && isSubjectiveValid && isAnyQuestionEnabled;

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#DFFF00] blur-[40px] opacity-40 animate-pulse rounded-full"></div>
          <div className="relative w-24 h-24 bg-black rounded-[2.5rem] flex items-center justify-center text-[#DFFF00] shadow-2xl rotate-12">
            <PartyPopper size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-[#A020F0] rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
            <Check size={24} strokeWidth={4} />
          </div>
        </div>

        <h2 className="text-3xl font-black tracking-tight mb-2">캠페인 생성 완료!</h2>
        <p className="text-slate-500 font-bold text-sm mb-10 leading-relaxed">
          방금 생성하신 캠페인이 타깃 유저들에게<br/>노출되기 시작했습니다.
        </p>

        <div className="w-full bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 mb-12 space-y-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Campaign Title</p>
              <p className="font-black text-slate-800 truncate max-w-[200px]">{title || "새로운 캠페인"}</p>
            </div>
          </div>
          <div className="h-px bg-slate-50 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target</p>
              <div className="flex gap-1">
                {selectedAges.slice(0, 2).map(age => (
                  <span key={age} className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-md text-slate-600">{age}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Goal</p>
              <p className="text-sm font-black text-[#A020F0]">{targetGoal} Insights</p>
            </div>
          </div>
        </div>

        <button 
          onClick={onSuccess}
          className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all"
        >
          대시보드로 가기
          <ArrowRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto pb-32 px-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 sticky top-0 bg-white/90 backdrop-blur-md z-10 py-2">
        <div className="flex items-center gap-2">
          {(mode !== 'choice' || step > 1) && (
            <button 
              onClick={() => { 
                if (step > 1) setStep(step - 1);
                else setMode('choice'); 
              }}
              className="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-500 active:scale-90 transition-transform"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight leading-none">
              {step === 5 ? '질문 구성' : (mode === 'ai' && step === 3 ? 'AI 분석 결과' : '캠페인 생성')}
            </h1>
            <span className="text-[10px] font-black text-[#A020F0] mt-1 tracking-widest uppercase">Step {step} of 5</span>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-400 font-bold hover:text-slate-600 transition-colors">닫기</button>
      </div>

      {mode === 'choice' && (
        <div className="space-y-6 pt-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="space-y-1 mb-8">
            <h2 className="text-xl font-black">비교할 상품을<br/>어떻게 등록할까요?</h2>
            <p className="text-sm text-slate-500 font-medium">원하시는 등록 방식을 선택해주세요.</p>
          </div>
          <div className="grid gap-4">
            <button onClick={() => { setMode('direct'); setStep(4); }} className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 text-left hover:border-black transition-all active:scale-[0.98]">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-black group-hover:text-[#DFFF00] transition-colors"><ImageIcon size={28} /></div>
                <div><h3 className="font-black text-lg">직접 이미지 업로드</h3><p className="text-xs text-slate-400 font-bold">이미지를 업로드하고 제목을 직접 적습니다.</p></div>
              </div>
            </button>
            <button onClick={() => { setMode('ai'); setStep(1); }} className="group relative bg-white border-2 border-slate-100 rounded-[2.5rem] p-6 text-left hover:border-[#A020F0] transition-all active:scale-[0.98] overflow-hidden">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#A020F0]/10 rounded-2xl flex items-center justify-center text-[#A020F0] group-hover:bg-[#A020F0] group-hover:text-[#DFFF00] transition-colors"><Sparkles size={28} /></div>
                <div><h3 className="font-black text-lg">AI 상세페이지 분석</h3><p className="text-xs text-slate-400 font-bold">URL에서 핵심 질문 섹션을 자동 추출합니다.</p></div>
              </div>
            </button>
          </div>
        </div>
      )}

      {mode === 'ai' && step === 1 && (
        <div className="space-y-8 py-4 animate-in slide-in-from-right-4 duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#A020F0]/10 rounded-3xl flex items-center justify-center mx-auto mb-4"><Link size={32} className="text-[#A020F0]" /></div>
            <h2 className="text-xl font-black">상품 URL 입력</h2><p className="text-sm text-slate-500 font-medium">분석할 상품의 상세페이지 주소를 넣어주세요.</p>
          </div>
          <div className="space-y-4">
            <div className="relative group">
              <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.musinsa.com/products/..." className="w-full pl-12 pr-4 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-[#A020F0] transition-all font-bold text-slate-800 shadow-sm" />
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <button onClick={handleStartAIAnalysis} disabled={!url} className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all disabled:opacity-30"><Sparkles size={20} className="text-[#DFFF00]" />분석 시작하기</button>
          </div>
        </div>
      )}

      {mode === 'ai' && step === 2 && (
        <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-slate-100 border-t-[#A020F0] rounded-full animate-spin" />
            <Zap size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#A020F0] animate-pulse" />
          </div>
          <div className="text-center space-y-3"><h2 className="text-xl font-black text-slate-800">{loadingMessages[loadingStep]}</h2><div className="flex gap-1 justify-center">{[0, 1, 2, 3].map(i => (<div key={i} className={`w-2 h-2 rounded-full transition-colors duration-300 ${i <= loadingStep ? 'bg-[#A020F0]' : 'bg-slate-200'}`} />))}</div></div>
        </div>
      )}

      {mode === 'ai' && step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-400">
          <div className="bg-[#A020F0]/5 border border-[#A020F0]/10 p-5 rounded-[2.5rem] mb-4">
            <p className="text-sm font-bold text-slate-600 flex items-center gap-2"><Sparkles size={16} className="text-[#A020F0]" />상세페이지에서 3개의 핵심 섹션을 찾았습니다!</p>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">소비자에게 질문하고 싶은 섹션을 선택하세요.</p>
          </div>
          <div className="space-y-4">
            {ANALYSIS_RESULTS.map((cluster) => (
              <div key={cluster.id} onClick={() => handleSelectCluster(cluster.id)} className={`group relative bg-white rounded-[2rem] p-6 border-2 transition-all cursor-pointer ${selectedCluster === cluster.id ? 'border-[#A020F0] ring-4 ring-[#A020F0]/5 shadow-xl scale-[1.02]' : 'border-slate-100 hover:border-slate-300'}`}>
                <div className="flex justify-between items-start mb-3"><span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${selectedCluster === cluster.id ? 'bg-[#A020F0] text-white' : 'bg-slate-100 text-slate-500'}`}>{cluster.label}</span>{selectedCluster === cluster.id && (<div className="w-6 h-6 bg-[#A020F0] rounded-full flex items-center justify-center animate-in zoom-in duration-200"><Check size={14} className="text-white" strokeWidth={4} /></div>)}</div>
                <h4 className="text-xl font-black mb-2">{cluster.title}</h4><p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">{cluster.desc}</p>
                <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100"><p className="text-[11px] font-black text-[#A020F0] italic">{cluster.suggestion}</p></div>
                <div className="flex gap-2">{cluster.images.map((img, idx) => (<div key={idx} className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-sm"><img src={img} className="w-full h-full object-cover" /></div>))}</div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-50"><button onClick={() => setStep(4)} disabled={!selectedCluster} className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-20">다음 단계로<ArrowRight size={20} /></button></div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 신상 크롭 니트 선호도 조사" className="w-full px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:border-black transition-all font-bold" />
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-2 mb-2"><Users2 size={18} className="text-[#A020F0]" /><h3 className="text-sm font-black">타깃층 설정</h3></div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">성별</p>
                <div className="flex p-1 bg-slate-100 rounded-2xl">{(['all', 'male', 'female'] as const).map((g) => (<button key={g} onClick={() => setTargetGender(g)} className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${targetGender === g ? 'bg-white shadow-sm text-black' : 'text-slate-400'}`}>{g === 'all' ? '전체' : g === 'male' ? '남성' : '여성'}</button>))}</div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest 연령대">연령대</p>
                <div className="flex flex-wrap gap-2">{TARGET_AGES.map((age) => (<button key={age} onClick={() => toggleAge(age)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedAges.includes(age) ? 'bg-[#DFFF00] border-[#DFFF00] text-black' : 'bg-white border-slate-100 text-slate-400'}`}>{age}</button>))}</div>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">관심 카테고리</p>
                <div className="flex flex-wrap gap-2">{TARGET_INTERESTS.map((interest) => (<button key={interest} onClick={() => toggleInterest(interest)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${selectedInterests.includes(interest) ? 'bg-black border-black text-[#DFFF00]' : 'bg-white border-slate-100 text-slate-400'}`}>#{interest}</button>))}</div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm space-y-4">
              <div className="flex justify-between items-center"><div className="flex items-center gap-2"><Target size={18} className="text-[#A020F0]" /><label className="text-sm font-black">목표 답변 수</label></div><span className="text-xl font-black text-[#A020F0]">{targetGoal}건</span></div>
              <input type="range" min="50" max="500" step="50" value={targetGoal} onChange={(e) => setTargetGoal(parseInt(e.target.value))} className="w-full accent-[#A020F0]" />
            </div>
          </div>
          <button onClick={() => setStep(5)} className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">질문 구성하기<ArrowRight size={20} /></button>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
          <div className="space-y-6">
            {/* Objective Questions Section */}
            <div className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all shadow-sm space-y-6 ${objectiveEnabled ? 'border-[#DFFF00] ring-4 ring-[#DFFF00]/5' : 'border-slate-100 opacity-60'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${objectiveEnabled ? 'bg-[#DFFF00] text-black' : 'bg-slate-100 text-slate-400'}`}>
                    <ListChecks size={18} />
                  </div>
                  <h3 className={`text-sm font-black uppercase tracking-tight ${objectiveEnabled ? 'text-black' : 'text-slate-400'}`}>객관식 질문</h3>
                </div>
                <button 
                  onClick={() => setObjectiveEnabled(!objectiveEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${objectiveEnabled ? 'bg-[#DFFF00]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${objectiveEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {objectiveEnabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Question</label>
                      <span className={`text-[10px] font-bold ${objectiveQuestion.length > QUESTION_MAX_LENGTH ? 'text-rose-500' : 'text-slate-300'}`}>{objectiveQuestion.length}/{QUESTION_MAX_LENGTH}</span>
                    </div>
                    <input type="text" value={objectiveQuestion} maxLength={QUESTION_MAX_LENGTH} onChange={(e) => setObjectiveQuestion(e.target.value)} placeholder="가장 마음에 드는 포인트는?" className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#DFFF00] rounded-2xl focus:outline-none transition-all font-bold text-sm" />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Options (Max 4)</label>
                    <div className="grid gap-2">
                      {objectiveOptions.map((opt, idx) => (
                        <div key={idx} className="relative group animate-in slide-in-from-top-1 duration-200">
                          <input type="text" value={opt} maxLength={OPTION_MAX_LENGTH} onChange={(e) => handleOptionChange(idx, e.target.value)} placeholder={`보기 ${idx + 1}`} className="w-full pl-5 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-[#DFFF00] font-bold text-xs" />
                          <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300">{opt.length}/{OPTION_MAX_LENGTH}</div>
                          {objectiveOptions.length > 2 && (<button onClick={() => handleRemoveOption(idx)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>)}
                        </div>
                      ))}
                      
                      {/* Integrated Others Option Toggle - Fixed Animation */}
                      <div className={`flex items-center justify-between pl-5 pr-4 py-3 border rounded-xl transition-all duration-300 ${othersEnabled ? 'bg-[#DFFF00]/10 border-[#DFFF00]' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                        <div className="flex flex-col">
                          <span className={`text-xs font-black ${othersEnabled ? 'text-black' : 'text-slate-500'}`}>'기타' 답변 활성화</span>
                          <span className="text-[8px] font-bold text-slate-400">참여자가 직접 옵션을 적을 수 있습니다.</span>
                        </div>
                        <button 
                          onClick={() => setOthersEnabled(!othersEnabled)}
                          className={`w-12 h-6 rounded-full relative transition-all duration-300 ${othersEnabled ? 'bg-[#DFFF00]' : 'bg-slate-300'}`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${othersEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {objectiveOptions.length < 4 && (
                        <button onClick={handleAddOption} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 flex items-center justify-center gap-2 hover:border-[#DFFF00] hover:text-[#A020F0] transition-all"><Plus size={14} /><span className="text-[10px] font-black uppercase">Add Option</span></button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subjective Question Section */}
            <div className={`bg-white p-6 rounded-[2.5rem] border-2 transition-all shadow-sm space-y-6 ${subjectiveEnabled ? 'border-[#A020F0] ring-4 ring-[#A020F0]/5' : 'border-slate-100 opacity-60'}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${subjectiveEnabled ? 'bg-[#A020F0] text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <MessageSquare size={18} />
                  </div>
                  <h3 className={`text-sm font-black uppercase tracking-tight transition-colors ${subjectiveEnabled ? 'text-[#A020F0]' : 'text-slate-400'}`}>주관식 질문</h3>
                </div>
                <button 
                  onClick={() => setSubjectiveEnabled(!subjectiveEnabled)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${subjectiveEnabled ? 'bg-[#A020F0]' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${subjectiveEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {subjectiveEnabled && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Insight Question</label>
                      <span className={`text-[10px] font-bold ${subjectiveQuestion.length > QUESTION_MAX_LENGTH ? 'text-rose-500' : 'text-slate-300'}`}>{subjectiveQuestion.length}/{QUESTION_MAX_LENGTH}</span>
                    </div>
                    <input 
                      type="text" 
                      value={subjectiveQuestion} 
                      maxLength={QUESTION_MAX_LENGTH} 
                      onChange={(e) => setSubjectiveQuestion(e.target.value)} 
                      placeholder="구체적인 이유를 질문해주세요!" 
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-[#A020F0] rounded-2xl focus:outline-none transition-all font-bold text-sm" 
                    />
                  </div>
                  <div className="flex items-start gap-2 bg-[#A020F0]/5 p-3 rounded-xl border border-[#A020F0]/10">
                    <AlertCircle size={14} className="text-[#A020F0] shrink-0 mt-0.5" />
                    <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                      주관식 답변은 셀러님에게 'Deep Insight'로 전달되는 핵심 데이터입니다.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Hint if none enabled */}
            {!isAnyQuestionEnabled && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                <AlertCircle size={18} className="text-rose-500" />
                <p className="text-xs font-bold text-rose-600">최소 한 개 이상의 질문 유형을 선택해야 합니다.</p>
              </div>
            )}
          </div>

          <button 
            onClick={handleStartCampaign} 
            disabled={!isFinalStepValid} 
            className="w-full py-5 bg-black text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-20"
          >
            캠페인 최종 생성
            <Sparkles size={20} className="text-[#DFFF00]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateCampaignForm;
