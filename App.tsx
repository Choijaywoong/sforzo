
import React, { useState, useMemo, useEffect } from 'react';
// Added ChevronUp to lucide-react imports to fix missing component error on line 384
import { PlusCircle, User, LayoutDashboard, Settings, BarChart3, Coins, Wallet, Sparkles, LayoutGrid, ArrowRightLeft, UserCircle, Briefcase, Play, ChevronUp } from 'lucide-react';
import SellerDashboard from './components/SellerDashboard';
import CreateCampaignForm from './components/CreateCampaignForm';
import UserFeed from './components/UserFeed';
import UserReelFeed from './components/UserReelFeed';
import VoteOverlay from './components/VoteOverlay';
import { Campaign, AppView, AppRole } from './types';

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    title: 'Autumn Hoodies Trend Check',
    thumbnailA: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=400&q=80',
    thumbnailB: 'https://images.unsplash.com/photo-1556821957-37604130004f?auto=format&fit=crop&w=400&q=80',
    totalVotes: 1240,
    insightCount: 85,
    goalCount: 100,
    status: 'active',
    createdAt: '2023-10-01',
    isRead: true,
    rewardLight: 100,
    rewardDeep: 500,
    isHot: true,
    objectiveQuestion: '이 디자인의 가장 큰 매력은 무엇인가요?',
    objectiveOptions: ['세련된 핏감', '유니크한 컬러', '소재의 고급스러움', '가성비'],
    subjectiveQuestion: '선택하신 이유를 조금 더 자세히 알려주세요!'
  },
  {
    id: '2',
    title: 'Minimalist Furniture Insight',
    thumbnailA: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80',
    thumbnailB: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80',
    totalVotes: 3200,
    insightCount: 500,
    goalCount: 500,
    status: 'completed',
    createdAt: '2023-09-15',
    isRead: false,
    rewardLight: 50,
    rewardDeep: 200,
    isHot: true,
    objectiveQuestion: '거실 분위기에 어울리는 정도는?',
    objectiveOptions: ['매우 잘 어울림', '보통임', '어울리지 않음'],
    subjectiveQuestion: '어떤 공간에 배치하고 싶으신가요?'
  },
  {
    id: '3',
    title: 'Premium Winter Collection',
    thumbnailA: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
    thumbnailB: 'https://images.unsplash.com/photo-1539533377285-bb41e5c47585?auto=format&fit=crop&w=400&q=80',
    totalVotes: 450,
    insightCount: 12,
    goalCount: 200,
    status: 'active',
    createdAt: '2023-10-10',
    isRead: true,
    rewardLight: 150,
    rewardDeep: 600,
    isHot: false,
    objectiveQuestion: '보온성이 어느 정도일 것 같나요?',
    objectiveOptions: ['매우 따뜻할 것 같음', '적당할 것 같음', '가벼워 보임'],
    subjectiveQuestion: '겨울 아우터 구매 시 가장 중요하게 생각하는 포인트는?'
  }
];

export type SortCriteria = 'rate' | 'most' | 'fewest' | 'custom';

const WalletView = ({ points }: { points: number }) => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-end">
      <h2 className="text-2xl font-black">나의 월렛</h2>
      <button className="text-[10px] font-black text-[#A020F0] uppercase tracking-widest bg-[#A020F0]/5 px-3 py-1 rounded-full">History</button>
    </div>
    
    <div className="bg-black text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
      <Sparkles className="absolute -top-4 -right-4 text-[#DFFF00]/20" size={120} />
      <div className="relative z-10">
        <p className="text-[10px] font-black text-[#DFFF00] uppercase tracking-[0.3em] mb-4">Total Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black italic">{points.toLocaleString()}</span>
          <span className="text-xl font-black text-[#DFFF00]">P</span>
        </div>
      </div>
      <div className="mt-10 flex gap-2 relative z-10">
        <button className="flex-1 py-4 bg-[#DFFF00] text-black rounded-2xl font-black text-sm active:scale-95 transition-transform">환급 신청</button>
        <button className="flex-1 py-4 bg-white/10 backdrop-blur-md rounded-2xl font-black text-sm active:scale-95 transition-transform">포인트 전환</button>
      </div>
    </div>

    <div className="space-y-4 pt-4">
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">이번 주 리워드 현황</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400">참여 캠페인</span>
          <span className="text-2xl font-black">12 <span className="text-xs text-slate-300">건</span></span>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col gap-2">
          <span className="text-[10px] font-bold text-slate-400">Deep Insights</span>
          <span className="text-2xl font-black text-[#A020F0]">8 <span className="text-xs text-slate-300">건</span></span>
        </div>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [role, setRole] = useState<AppRole>('user');
  const [activeView, setActiveView] = useState<AppView>('feed');
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayIndex, setOverlayIndex] = useState(0);

  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('custom');
  
  const [userPoints, setUserPoints] = useState(2450);
  
  // 참여 정보를 담는 상태 객체 (캠페인 + 이전 선택값)
  const [participation, setParticipation] = useState<{ 
    campaign: Campaign, 
    initialSelection: 'A' | 'B' | null 
  } | null>(null);

  const sortedCampaigns = useMemo(() => {
    if (sortCriteria === 'custom') return campaigns;
    const items = [...campaigns];
    const sortFn = (a: Campaign, b: Campaign) => {
      if (sortCriteria === 'rate') return (b.insightCount / b.goalCount) - (a.insightCount / a.goalCount);
      if (sortCriteria === 'most') return b.insightCount - a.insightCount;
      if (sortCriteria === 'fewest') return a.insightCount - b.insightCount;
      return 0;
    };
    return items.sort(sortFn);
  }, [campaigns, sortCriteria]);

  const toggleRole = () => {
    const newRole = role === 'seller' ? 'user' : 'seller';
    setRole(newRole);
    setActiveView(newRole === 'seller' ? 'dashboard' : 'feed');
    setIsOverlayOpen(false);
  };

  const navigateTo = (view: AppView) => {
    if (view === 'dashboard' || view === 'feed' || view === 'reel') {
      setIsOverlayOpen(false);
      setActiveView(view);
    } else {
      let index = 0;
      if (view === 'create') index = 0;
      if (view === 'reports' || view === 'wallet') index = 1;
      if (view === 'profile') index = 2;
      
      setOverlayIndex(index);
      setActiveView(view);
      setIsOverlayOpen(true);
    }
  };

  const handleParticipate = (campaign: Campaign, selection: 'A' | 'B' | null = null) => {
    setParticipation({ campaign, initialSelection: selection });
  };

  const handleRewardComplete = (points: number) => {
    setUserPoints(prev => prev + points);
    setTimeout(() => {
      setParticipation(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col max-w-md mx-auto relative overflow-hidden font-sans">
      {/* --- MAIN LAYER (BASE) --- */}
      <div 
        className={`flex-1 bg-[#F8F9FA] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-top pb-32 ${
          isOverlayOpen ? 'scale-[0.93] blur-[4px] opacity-40 rounded-b-[3rem] overflow-hidden pointer-events-none' : 'scale-100'
        } ${activeView === 'reel' ? 'bg-black' : ''}`}
      >
        {activeView !== 'reel' && (
          <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center">
                <span className="text-[#DFFF00] font-black text-xl">P</span>
              </div>
              <span className="font-black text-xl tracking-tighter">Pick-it</span>
            </div>
            <div className="flex items-center gap-4">
              {role === 'seller' ? (
                <Settings size={20} className="text-slate-400 hover:text-black cursor-pointer transition-colors" />
              ) : (
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                  <Coins size={14} className="text-[#A020F0]" />
                  <span className="text-xs font-black">{userPoints.toLocaleString()}</span>
                </div>
              )}
            </div>
          </nav>
        )}

        <main className={activeView === 'reel' ? 'h-screen' : ''}>
          {activeView !== 'reel' && (
            <div className="px-6 pt-6 flex justify-end animate-in fade-in slide-in-from-top-2 duration-700">
              <button 
                onClick={toggleRole}
                className="group bg-black text-white px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all ring-2 ring-[#DFFF00]/20 hover:ring-[#DFFF00]/50"
              >
                <div className="relative flex items-center justify-center">
                  {role === 'seller' ? <Briefcase size={14} className="text-[#DFFF00]" /> : <UserCircle size={14} className="text-[#DFFF00]" />}
                  <div className="absolute inset-0 w-full h-full animate-ping opacity-20 bg-[#DFFF00] rounded-full" />
                </div>
                <span className="text-white">{role === 'seller' ? 'Seller' : 'Viewer'}</span>
                <div className="h-3 w-px bg-white/20" />
                <ArrowRightLeft size={12} className="text-[#DFFF00] group-hover:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          )}

          {role === 'seller' ? (
            <SellerDashboard 
              campaigns={sortedCampaigns} 
              sortCriteria={sortCriteria}
              onSortChange={setSortCriteria}
            />
          ) : activeView === 'reel' ? (
            <UserReelFeed 
              campaigns={campaigns} 
              onParticipate={handleParticipate} 
              userPoints={userPoints} 
            />
          ) : (
            <UserFeed 
              campaigns={campaigns} 
              onParticipate={handleParticipate} 
              userPoints={userPoints} 
              mode="all"
            />
          )}
        </main>
      </div>

      {activeView === 'reel' && !isOverlayOpen && (
        <button 
          onClick={toggleRole}
          className="fixed top-6 right-6 z-50 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-full border border-white/20 flex items-center gap-2"
        >
          <ArrowRightLeft size={14} className="text-[#DFFF00]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Exit Reel</span>
        </button>
      )}

      {/* --- DIMMER BACKGROUND --- */}
      <div 
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-500 ease-out ${
          isOverlayOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => navigateTo(role === 'seller' ? 'dashboard' : (activeView === 'reel' ? 'reel' : 'feed'))}
      />

      {/* --- OVERLAY LAYER (SLIDING VIEWS) --- */}
      <div 
        className={`fixed inset-0 z-40 flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none ${
          isOverlayOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div 
          className="mt-[8%] flex-1 bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.3)] flex flex-col pointer-events-auto overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={() => navigateTo(role === 'seller' ? 'dashboard' : (activeView === 'reel' ? 'reel' : 'feed'))}
            className="w-full h-12 flex items-center justify-center shrink-0 group active:scale-95 transition-transform sticky top-0 bg-white z-20"
          >
            <div className="w-12 h-1.5 bg-slate-200 group-hover:bg-slate-300 rounded-full transition-colors" />
          </button>

          <div className="flex-1 relative overflow-hidden">
            <div 
              className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{ transform: `translateX(-${overlayIndex * 100}%)` }}
            >
              <div className="w-full h-full shrink-0 overflow-y-auto custom-scrollbar px-1">
                {role === 'seller' ? (
                  <CreateCampaignForm 
                    onSuccess={() => navigateTo('dashboard')} 
                    onCancel={() => navigateTo('dashboard')} 
                  />
                ) : (
                   <div className="p-8 text-center pt-32">
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                       <Sparkles size={40} />
                     </div>
                     <p className="text-slate-400 font-bold">Pick-Reel에서 더 많은 상품을 구경하세요!</p>
                   </div>
                )}
              </div>

              <div className="w-full h-full shrink-0 overflow-y-auto custom-scrollbar">
                {role === 'seller' ? (
                  <div className="p-8 space-y-6">
                    <h2 className="text-2xl font-black">종합 분석 리포트</h2>
                    <div className="bg-slate-50 rounded-[2rem] p-10 flex flex-col items-center justify-center text-center space-y-4 border border-slate-100">
                      <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center text-[#A020F0]"><BarChart3 size={40} /></div>
                      <p className="font-bold text-slate-400">데이터를 분석하는 중입니다.</p>
                    </div>
                  </div>
                ) : (
                  <WalletView points={userPoints} />
                )}
              </div>

              <div className="w-full h-full shrink-0 overflow-y-auto custom-scrollbar">
                <div className="p-8 space-y-6">
                  <h2 className="text-2xl font-black">프로필 설정</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100">
                      <div className="w-16 h-16 rounded-2xl bg-slate-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=transparent" alt="Profile" />
                      </div>
                      <div>
                        <p className="font-black text-lg">최재웅</p>
                        <p className="text-xs font-bold text-slate-400">{role === 'seller' ? 'Pick-it Enterprise 셀러' : 'Pick-it 마스터'}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                      <p className="text-sm font-bold text-slate-500 mb-4">계정 관리</p>
                      <div className="space-y-3">
                        {['정보 수정', '알림 설정', '로그아웃'].map(item => (
                          <div key={item} className="flex justify-between items-center py-2 px-1 border-b border-slate-200 last:border-0">
                            <span className="font-bold text-slate-700">{item}</span>
                            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-300"><PlusCircle size={14} className="rotate-45" /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {participation && (
        <VoteOverlay 
          campaign={participation.campaign} 
          initialSelection={participation.initialSelection}
          onClose={() => setParticipation(null)}
          onComplete={handleRewardComplete}
        />
      )}

      {/* --- NAVIGATION BAR --- */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-[60] transition-transform duration-500 ${activeView === 'reel' && !isOverlayOpen ? 'translate-y-24' : 'translate-y-0'}`}>
        <div className="bg-black/90 backdrop-blur-2xl text-white rounded-[2.5rem] px-8 py-5 flex justify-between items-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] border border-white/10">
          <button 
            onClick={() => navigateTo(role === 'seller' ? 'dashboard' : 'feed')} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-75 ${activeView === (role === 'seller' ? 'dashboard' : 'feed') ? 'text-[#DFFF00]' : 'text-slate-500'}`}
          >
            {role === 'seller' ? <LayoutDashboard size={22} /> : <LayoutGrid size={22} />}
            <span className="text-[9px] font-black uppercase tracking-widest">{role === 'seller' ? 'Dashboard' : 'Feed'}</span>
          </button>
          
          <button 
            onClick={() => navigateTo(role === 'seller' ? 'create' : 'reel')} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-75 ${activeView === (role === 'seller' ? 'create' : 'reel') ? 'text-[#DFFF00]' : 'text-slate-500'}`}
          >
            {role === 'seller' ? <PlusCircle size={22} /> : <Play size={22} />}
            <span className="text-[9px] font-black uppercase tracking-widest">{role === 'seller' ? 'Create' : 'Reel'}</span>
          </button>
          
          <button 
            onClick={() => navigateTo(role === 'seller' ? 'reports' : 'wallet')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-75 ${activeView === (role === 'seller' ? 'reports' : 'wallet') ? 'text-[#DFFF00]' : 'text-slate-500'}`}
          >
            {role === 'seller' ? <BarChart3 size={22} /> : <Wallet size={22} />}
            <span className="text-[9px] font-black uppercase tracking-widest">{role === 'seller' ? 'Reports' : 'Wallet'}</span>
          </button>
          
          <button 
            onClick={() => navigateTo('profile')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 active:scale-75 ${activeView === 'profile' ? 'text-[#DFFF00]' : 'text-slate-500'}`}
          >
            <User size={22} />
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>
      </div>

      {activeView === 'reel' && !isOverlayOpen && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
           <button 
             onClick={() => navigateTo('feed')}
             className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40"
           >
             <ChevronUp size={24} />
           </button>
           <span className="text-[8px] text-white font-black uppercase tracking-widest mt-2">Back to Feed</span>
        </div>
      )}
    </div>
  );
};

export default App;
